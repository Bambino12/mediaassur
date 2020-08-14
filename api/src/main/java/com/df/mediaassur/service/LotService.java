package com.df.mediaassur.service;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;
import com.df.mediaassur.payload.LotRequest;
import com.df.mediaassur.payload.LotResponse;
import com.df.mediaassur.payload.PagedResponse;
import com.df.mediaassur.repository.AttestationRepository;
import com.df.mediaassur.repository.LotRepository;
import com.df.mediaassur.util.AppConstants;
import com.df.mediaassur.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class LotService {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    AttestationRepository attestationRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Lot> getAll(){
        return lotRepository.findAll();
    }

    public PagedResponse<LotResponse>  getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "id");

        Page<Lot> listItems = lotRepository.findAll(pageable);

        if(listItems.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), listItems.getNumber(),
                    listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
        }

        //List<Client> lst = clients.map(c -> { return c; }).getContent();

        return new PagedResponse<>(mapperListLots(listItems.getContent()), listItems.getNumber(),
                listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
    }

    public Boolean create(LotRequest lotRequest){
        Lot lot = null;
        try {

            lot = new Lot(lotRequest.getAssureId(), lotRequest.getAssureurId(), lotRequest.getNumeroPolice(), lotRequest.getStartDate(), lotRequest.getEndDate(), lotRequest.getFileName(), AppConstants.STATUS_LOT_NEW, AppConstants.STATUS_ATTESTATION_NEW);
            lot = lotRepository.save(lot);

            List<Attestation> attestations = lotRequest.getAttestations();

            for (Attestation attestation : attestations) {
                attestation.setLotId(lot.getId());
            }
            attestations = attestationRepository.saveAll(attestations);

        }catch (Exception e) {
            e.printStackTrace();
            if (lot != null) {
                if (lot.getId() != null) {
                    lotRepository.delete(lot);
                }
            }
            return false;
        }
        return true;
    }

    public List<LotResponse> mapperListLots(List<Lot> lots){

        List<LotResponse> mrArray = new ArrayList<>();
        if(lots.size() !=  0) {
            mrArray = lots.stream().map(item -> modelMapper.mapLotToLotResponse(item)).collect(Collectors.toList());
        }

        return mrArray;

        //return  clients.stream().map(client -> modelMapper.mapClientToClientResponse(client, null, null)).collect(Collectors.toList());
    }

    public LotResponse getById(Integer lotId){
       return modelMapper.mapLotToLotResponse(lotRepository.getOne(lotId));
    }

    public Boolean addAttestationToLot(Integer lotId, List<Attestation> attestations){
        try {
            Lot lot = lotRepository.getOne(lotId);

            for (Attestation attestation : attestations) {
                attestation.setLotId(lot.getId());
            }
            attestations = attestationRepository.saveAll(attestations);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }

        return true;

    }

    public List<LotResponse> getByAssureur(Integer assureurId){
        List<Lot> lots = lotRepository.findByAssureurId(assureurId);
        return mapperListLots(lots);
    }

    public List<LotResponse> getByAssure(Integer assureId){
        List<Lot> lots = lotRepository.findByAssureId(assureId);
        return mapperListLots(lots);
    }

    public void updateGenerateLot(Integer numeroAttestation, LotResponse lotResponse, String fileName, String typeAttestation) {

        try {
            Lot lot = lotRepository.getOne(lotResponse.getId());
            lot.setsNumeroAttestation(numeroAttestation);
            //lot.setFileName(fileName);

            if(typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE))
                lot.setStatusJaune(AppConstants.STATUS_LOT_GENERATED);
            else
                lot.setStatusCedeao(AppConstants.STATUS_LOT_GENERATED);

            for (Attestation attestation : lotResponse.getAttestations()) {
                try {
                    if (typeAttestation.equals(AppConstants.ATTESTATION_TYPE_JAUNE)){
                        attestation.setNumeroJaune(numeroAttestation);
                        attestation.setStatusJaune(AppConstants.STATUS_ATTESTATION_GENERATED);
                    }
                    else{
                        attestation.setNumeroCedeao(numeroAttestation);
                        attestation.setStatusCedeao(AppConstants.STATUS_ATTESTATION_GENERATED);
                    }


                    attestationRepository.save(attestation);
                    numeroAttestation++;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

        } catch (Exception e) {

        }

    }


}
