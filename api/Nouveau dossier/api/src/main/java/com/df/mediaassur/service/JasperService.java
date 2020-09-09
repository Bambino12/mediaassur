package com.df.mediaassur.service;


import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;
import com.df.mediaassur.payload.LotResponse;
import com.df.mediaassur.repository.AttestationRepository;
import com.df.mediaassur.repository.LotRepository;
import com.df.mediaassur.util.AppConstants;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.FileNotFoundException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service("jasperService")
public class JasperService
{

    @Autowired
    private Environment env;

    @Autowired
    private LotService lotService;

    @Autowired
    private LotRepository lotRepository;

    @Autowired
    private AttestationRepository attestationRepository;

    private static final Logger logger = LoggerFactory.getLogger(JasperService.class);

    public String generateAttestationByLotId(Integer lotId, Integer numeroAttestation, String typeAttestation) {

        typeAttestation = typeAttestation.trim().toLowerCase();
        String path_file = null;
        String fileName =  "lot_" + typeAttestation + "_" + lotId + ".pdf";
        LotResponse lotResponse = lotService.getById(lotId);

        logger.info("Logger informations :::::: === >>>> ");

        if((lotResponse.getStatusJaune() == AppConstants.STATUS_LOT_NEW && typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE)) ||
                (lotResponse.getStatusCedeao() == AppConstants.STATUS_LOT_NEW && typeAttestation.equals(AppConstants.ATTESTATION_TYPE_CEDEAO))) {

            logger.info("Logger in :::::: === >>>> ");

            String path = env.getProperty("file.upload-dir") + "/attestations";
            String temp_path = path + "/temp";

            //ContratHistories contratHistories = contratResponse.getLastHistorie();
            try {

                export(typeAttestation, lotResponse, path, temp_path, fileName);
                lotService.updateGenerateLot(numeroAttestation, lotResponse, fileName, typeAttestation);

            }
            catch (Exception e) {
                e.printStackTrace();
                fileName = null;
            }

        }


        if(fileName != null) {

            path_file = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/v1/files/get/" + AppConstants.FOLDER_ATTESTATION_UPLOAD + "/")
                    .path(fileName)
                    .toUriString();

        }

        return path_file;
    }

    public String generateOneAttestation(Integer attestationId, Integer numeroAttestation, String typeAttestation) {

        typeAttestation = typeAttestation.trim().toLowerCase();
        String path_file = null;

        Attestation old_attestation = attestationRepository.getOne(attestationId);

       if ((old_attestation.getStatusJaune() == AppConstants.STATUS_ATTESTATION_GENERATED && typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE)) ||
               (old_attestation.getStatusCedeao() == AppConstants.STATUS_ATTESTATION_GENERATED && typeAttestation.equals(AppConstants.ATTESTATION_TYPE_CEDEAO))){

           Attestation newAttestation = new Attestation(old_attestation.getLotId(), old_attestation.getNumeroJaune(), old_attestation.getNumeroCedeao(), old_attestation.getNumeroPolice(), old_attestation.getAssure(),old_attestation.getMarque(), old_attestation.getImmatriculation(),old_attestation.getDescription(),old_attestation.getDatedebut(),old_attestation.getDatefin(), old_attestation.getUsage(), old_attestation.getGenre(), old_attestation.getProfession(),old_attestation.getStatusJaune(), old_attestation.getStatusCedeao());

           if (typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE)) {
               old_attestation.setStatusJaune(AppConstants.STATUS_ATTESTATION_CANCELED);
               newAttestation.setStatusJaune(AppConstants.STATUS_ATTESTATION_NEW);
           }else{
               old_attestation.setStatusCedeao(AppConstants.STATUS_ATTESTATION_CANCELED);
               newAttestation.setStatusCedeao(AppConstants.STATUS_ATTESTATION_NEW);
           }

            attestationRepository.save(old_attestation);
            newAttestation = attestationRepository.save(newAttestation);

            attestationId = newAttestation.getId();
        }

        Attestation attestation = attestationRepository.getOne(attestationId);

        LotResponse lotResponse = lotService.getById(attestation.getLotId());
        lotResponse.setAttestations(Arrays.asList(new Attestation[]{attestation}));
        //ContratResponse contratResponse = modelMapper.mapContratToContratResponse(contratHistoriesId);
        String path = env.getProperty("file.upload-dir") + "/attestations";
        String temp_path = path + "/temp";
        String fileName = "attestation_" + typeAttestation + "_" +  attestationId + ".pdf";
        //ContratHistories contratHistories = contratResponse.getLastHistorie();
        try {

            export(typeAttestation, lotResponse, path, temp_path, fileName);

        }catch (Exception e){
            e.printStackTrace();
            fileName = null;
        }

        if(fileName != null) {

            path_file = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/v1/files/get/" + AppConstants.FOLDER_ATTESTATION_UPLOAD + "/")
                    .path(fileName)
                    .toUriString();


            if (typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE)){
                attestation.setStatusJaune(AppConstants.STATUS_ATTESTATION_GENERATED);
                attestation.setNumeroJaune(numeroAttestation);
            }
            else{
                attestation.setStatusCedeao(AppConstants.STATUS_ATTESTATION_GENERATED);
                attestation.setNumeroCedeao(numeroAttestation);
            }

            attestationRepository.save(attestation);

        }

        return path_file;
    }

    private void export(String typeAttestation, LotResponse lotResponse, String path, String temp_path, String fileName) throws FileNotFoundException, JRException {
        File file = ResourceUtils.getFile(temp_path + "/attestation.jrxml");
        SimpleDateFormat simpleDateFormat =  new SimpleDateFormat("dd/MM/yyyy hh:mm");

        if(typeAttestation.equals(AppConstants.ATTESTATION_TYPE_CEDEAO)) {
            file = ResourceUtils.getFile(temp_path + "/cattestation.jrxml");
            simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");
        }

        System.out.println("============================= >>>>> Before " + file.getPath());
        JasperReport jasperReport = JasperCompileManager.compileReport(file.getPath());
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(lotResponse.getAttestations());

        Map<String, Object> parameters = new HashMap<String, Object>();


        parameters.put("sDate", simpleDateFormat.format(lotResponse.getStartDate()));
        parameters.put("eDate", simpleDateFormat.format(lotResponse.getEndDate()));
        parameters.put("assureur", lotResponse.getAssureur());
        parameters.put("assureurAddress", lotResponse.getAssureurAddress());
        parameters.put("numeroPolice", lotResponse.getNumeroPolice());

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);

        JasperExportManager.exportReportToPdfFile(jasperPrint, path + "/" + fileName);
    }


}
