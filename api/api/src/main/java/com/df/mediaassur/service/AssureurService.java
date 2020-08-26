package com.df.mediaassur.service;

import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.payload.AssureResponse;
import com.df.mediaassur.payload.AssureurResponse;
import com.df.mediaassur.payload.PagedResponse;
import com.df.mediaassur.repository.AssureRepository;
import com.df.mediaassur.repository.AssureurRepository;
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
public class AssureurService {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    AssureurRepository assureurRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Assureur> getAll(){
        return assureurRepository.findAll();
    }

    public PagedResponse<Assureur>  getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "id");

        Page<Assureur> listItems = assureurRepository.findAll(pageable);

        if(listItems.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), listItems.getNumber(),
                    listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
        }

        //List<Client> lst = clients.map(c -> { return c; }).getContent();

        return new PagedResponse<>(listItems.getContent(), listItems.getNumber(),
                listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
    }

    public Boolean create(Assureur assureur){
         try {
             assureur = assureurRepository.save(assureur);
        }catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
    public boolean update(Assureur assureur) {
        try {
            assureur = assureurRepository.save(assureur);
            //System.out.println(repas.toString());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public List<AssureurResponse> mapperListAssure(List<Assureur> assureurs){

        List<AssureurResponse> mrArray = new ArrayList<>();
        if(assureurs.size() !=  0) {
            mrArray = assureurs.stream().map(item -> modelMapper.mapAssureurToAssureurResponse(item)).collect(Collectors.toList());
        }

        return mrArray;

        //return  clients.stream().map(client -> modelMapper.mapClientToClientResponse(client, null, null)).collect(Collectors.toList());
    }

    public AssureurResponse getById(Integer assureId){
       return modelMapper.mapAssureurToAssureurResponse(assureurRepository.getOne(assureId));
    }



}
