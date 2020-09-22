package com.df.mediaassur.util;

import com.df.mediaassur.model.*;
import com.df.mediaassur.payload.*;
import com.df.mediaassur.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ModelMapper {

    @Autowired
    AssureRepository assureRepository;

    @Autowired
    AssureurRepository assureurRepository;

    @Autowired
    AttestationRepository attestationRepository;

    @Autowired
    LotRepository lotRepository;

    @Autowired
    UserRepository userRepository;

    public LotResponse mapLotToLotResponse(Lot lot) {

        LotResponse lotResponse = new LotResponse();

        if(lot != null) {
            BeanUtils.copyProperties(lot, lotResponse);
            try {
                Assureur assureur = assureurRepository.getOne(lot.getAssureurId());
                lotResponse.setAttestations(attestationRepository.findByLotId(lot.getId()));
                lotResponse.setAssure(assureRepository.getOne(lot.getAssureId()).getName());
                lotResponse.setAssureur(assureur.getName());
                lotResponse.setAssureurAddress(assureur.getAddress());
                ////lotResponse.setCreator(userRepository.getOne(lot.getCreatedBy()).getName());

            }catch (Exception e){
                e.printStackTrace();
            }

        }

        return lotResponse;
    }

    public AssureResponse mapAssureToAssureResponse(Assure assure) {

        AssureResponse assureResponse = new AssureResponse();

        if(assure != null) {
            BeanUtils.copyProperties(assure, assureResponse);
            try {
                assureResponse.setLots(lotRepository.findByAssureId(assure.getId()));
                assureResponse.setCreator(userRepository.getOne(assure.getCreatedBy()).getName());

            }catch (Exception e){
                e.printStackTrace();
            }

        }

        return assureResponse;
    }


    public MarqueResponse mapMarqueToMarqueResponse(Marque marque) {

        MarqueResponse marqueResponse = new MarqueResponse();

        if(marque != null) {
            BeanUtils.copyProperties(marque,marqueResponse);
            try {
                marqueResponse.setLots(lotRepository.findByAssureId(marque.getId()));
                marqueResponse.setCreator(userRepository.getOne(marque.getCreatedBy()).getName());

            }catch (Exception e){
                e.printStackTrace();
            }

        }

        return marqueResponse;
    }

    public AssureurResponse mapAssureurToAssureurResponse(Assureur assureur) {

        AssureurResponse assureurResponse = new AssureurResponse();

        if(assureur != null) {
            BeanUtils.copyProperties(assureur, assureurResponse);
            try {
                assureurResponse.setLots(lotRepository.findByAssureurId(assureur.getId()));
                assureurResponse.setCreator(userRepository.getOne(assureur.getCreatedBy()).getName());

            }catch (Exception e){
                e.printStackTrace();
            }

        }

        return assureurResponse;
    }

}
