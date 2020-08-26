package com.df.mediaassur.service;

import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;
import com.df.mediaassur.payload.AssureResponse;
import com.df.mediaassur.payload.LotRequest;
import com.df.mediaassur.payload.LotResponse;
import com.df.mediaassur.payload.PagedResponse;
import com.df.mediaassur.repository.AssureRepository;
import com.df.mediaassur.repository.AttestationRepository;
import com.df.mediaassur.repository.LotRepository;
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
public class AssureService {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    AssureRepository assureRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Assure> getAll(){
        return assureRepository.findAll();
    }

    public PagedResponse<Assure>  getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "id");

        Page<Assure> listItems = assureRepository.findAll(pageable);

        if(listItems.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), listItems.getNumber(),
                    listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
        }

        //List<Client> lst = clients.map(c -> { return c; }).getContent();

        return new PagedResponse<>(listItems.getContent(), listItems.getNumber(),
                listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
    }

    public Boolean create(Assure assure){
         try {
             assure = assureRepository.save(assure);
        }catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public Boolean update(Assure assure) {
        try {
            assure = assureRepository.save(assure);
            //System.out.println(repas.toString());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<AssureResponse> mapperListAssure(List<Assure> assures){

        List<AssureResponse> mrArray = new ArrayList<>();
        if(assures.size() !=  0) {
            mrArray = assures.stream().map(item -> modelMapper.mapAssureToAssureResponse(item)).collect(Collectors.toList());
        }

        return mrArray;

        //return  clients.stream().map(client -> modelMapper.mapClientToClientResponse(client, null, null)).collect(Collectors.toList());
    }

    public AssureResponse getById(Integer assureId){
       return modelMapper.mapAssureToAssureResponse(assureRepository.getOne(assureId));
    }



}
