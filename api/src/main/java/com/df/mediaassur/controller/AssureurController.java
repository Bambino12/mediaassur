package com.df.mediaassur.controller;

import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.payload.*;
import com.df.mediaassur.repository.LotRepository;
import com.df.mediaassur.service.AssureService;
import com.df.mediaassur.service.AssureurService;
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
 * Created by rajeevkumarsingh on 02/08/17.
 */
@RestController
@RequestMapping("/v1/assureurs")
public class AssureurController {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    LotService lotService;

    @Autowired
    AssureurService assureurService;

    private static final Logger logger = LoggerFactory.getLogger(AssureurController.class);

    @GetMapping
    public List<Assureur> getAll() {
        return assureurService.getAll();
        //return userService.getAll();
    }

    @GetMapping("{assureurId}")
    public AssureurResponse getOne(@PathVariable Integer assureurId) {
        return assureurService.getById(assureurId);
        //return userService.getAll();
    }

    @GetMapping("/sort")
    public PagedResponse<Assureur> getAll(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                               @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return assureurService.getAll(page, size);
    }
    @PostMapping
    public ResponseEntity<?> Create(@Valid @RequestBody Assureur assureur) {

        Boolean isCreated = assureurService.create(assureur);

        if(isCreated){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Assureur cree avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la creation de l'assure"));
        }

    }

    @GetMapping("{assureurId}/lots")
    public List<LotResponse> getAssueurLots(@PathVariable Integer assureurId) {
        return lotService.getByAssureur(assureurId);
        //return userService.getAll();
    }




}
