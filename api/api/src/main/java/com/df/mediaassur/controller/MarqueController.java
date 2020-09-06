package com.df.mediaassur.controller;

import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.model.Marque;
import com.df.mediaassur.payload.ApiResponse;
import com.df.mediaassur.payload.MarqueResponse;
import com.df.mediaassur.repository.MarqueRepository;
import com.df.mediaassur.service.MarqueService;
import com.df.mediaassur.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("v1/marque")
public class MarqueController {


    @Autowired
    MarqueRepository marqueRepository;

    @Autowired
    MarqueService marqueService;


    private static final Logger logger = LoggerFactory.getLogger(MarqueController.class);

    @GetMapping
    public List<Marque> getAll() {
        return marqueService.getAll();
    }

    @GetMapping("{marqueId}")
    public MarqueResponse getOne(@PathVariable Integer marqueId) {
        return marqueService.getById(marqueId);
    }

    @PostMapping
    public ResponseEntity<?> Create(@Valid @RequestBody Marque marque) {

        Boolean isCreated = marqueService.create(marque);

        if(isCreated){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Assure cree avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la creation de l'assure"));
        }
    }

    //Update Marque
    @PostMapping(value = "/upd")
    public boolean upd(@RequestBody Marque marque) {
        return marqueService.update(marque);
    }

    //
//    @DeleteMapping(value = "{id}")
//    public void delete(@PathVariable Integer id){
//        marqueService.delete(id);
//    }
}