package com.df.mediaassur.controller;

import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;
import com.df.mediaassur.payload.*;
import com.df.mediaassur.repository.AssureRepository;
import com.df.mediaassur.repository.AttestationRepository;
import com.df.mediaassur.repository.LotRepository;
import com.df.mediaassur.service.AssureService;
import com.df.mediaassur.service.LotService;
import com.df.mediaassur.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Created by zola on 02/08/17.
 */
@RestController
@RequestMapping("/v1/assures")
public class AssureController {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    LotService lotService;

    @Autowired
    AssureService assureService;

    private static final Logger logger = LoggerFactory.getLogger(AssureController.class);

    @GetMapping
    public List<Assure> getAll() {
        return assureService.getAll();
        //return userService.getAll();
    }

    @GetMapping("{assureId}")
    public AssureResponse getOne(@PathVariable Integer assureId) {
        return assureService.getById(assureId);
        //return userService.getAll();
    }

    @GetMapping("/sort")
    public PagedResponse<Assure> getAll(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                                @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return assureService.getAll(page, size);
    }

    @PostMapping
    public ResponseEntity<?> Create(@Valid @RequestBody Assure assure) {

        Boolean isCreated = assureService.create(assure);

        if(isCreated){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Assure cree avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la creation de l'assure"));
        }

    }

    //Update Assure
    @PostMapping(value = "/upd")
    public boolean upd(@RequestBody Assure assure) {

        return assureService.update(assure);
    }


    @GetMapping("{assureId}/lots")
    public List<LotResponse> getAssueLots(@PathVariable Integer assureId) {
        return lotService.getByAssure(assureId);
        //return userService.getAll();
    }

//    @PostMapping(value = "/updAssure")
//    public boolean updAssure(@RequestBody Assure assure){
//        return assureService.
//    }

//    SUPPRESSION D'ASSURER
    public void Assure(int id){
        assureService.deleteById(id);

    }
}
