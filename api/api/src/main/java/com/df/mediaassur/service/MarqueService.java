package com.df.mediaassur.service;

import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.Marque;
import com.df.mediaassur.payload.AssureResponse;
import com.df.mediaassur.payload.MarqueResponse;
import com.df.mediaassur.payload.PagedResponse;
import com.df.mediaassur.repository.MarqueRepository;
import com.df.mediaassur.util.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MarqueService {
    @Autowired
    MarqueRepository marqueRepository;

    @Autowired
    ModelMapper modelMapper;

    public List<Marque> getAll(){
        return marqueRepository.findAll();
    }
    public PagedResponse<Object> getAll(int page, int size){
        Pageable pageable = PageRequest.of(page, size, Sort.Direction.DESC, "id");

        Page<Marque> listItems = marqueRepository.findAll(pageable);

        if(listItems.getNumberOfElements() == 0) {
            return new PagedResponse<>(Collections.emptyList(), listItems.getNumber(),
                    listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());
        }
        return null;
        //List<Client> lst = clients.map(c -> { return c; }).getContent();
 /*       return new PagedResponse<>(listItems.getContent(), listItems.getNumber(),
                listItems.getSize(), listItems.getTotalElements(), listItems.getTotalPages(), listItems.isLast());*/
    }

    public Boolean create(@Valid Marque marque){
        try {
            marque = marqueRepository.save(marque);
        }catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public Boolean update(Marque marque) {
        try {
            marque = marqueRepository.save(marque);
            //System.out.println(repas.toString());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<MarqueResponse> mapperListMarque(List<Marque> marque){

        List<MarqueResponse> mrArray = new ArrayList<>();
        if(marque.size() !=  0) {
            mrArray = marque.stream().map(item -> modelMapper.mapMarqueToMarqueResponse(item)).collect(Collectors.toList());
        }

        return mrArray;
    }
    public MarqueResponse getById(Integer marqueId){
        return modelMapper.mapMarqueToMarqueResponse(marqueRepository.getOne(marqueId));
    }
    public Boolean delete(int id) {
        Marque marqueRepository = new Marque(id);
        int index = data.indexOf(marqueRepository);
        if (index>=0){
            data.remove(index);
            return true;
        }
        return false;
    }
}
