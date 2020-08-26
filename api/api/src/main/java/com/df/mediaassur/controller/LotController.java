package com.df.mediaassur.controller;

import com.df.mediaassur.model.*;
import com.df.mediaassur.payload.*;
import com.df.mediaassur.repository.AttestationRepository;
import com.df.mediaassur.repository.LotRepository;
import com.df.mediaassur.service.JasperService;
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
@RequestMapping("/v1/lots")
public class LotController {

    @Autowired
    LotRepository lotRepository;

    @Autowired
    LotService lotService;

    @Autowired
    JasperService jasperService;

    @Autowired
    AttestationRepository attestationRepository;

    private static final Logger logger = LoggerFactory.getLogger(LotController.class);

    @GetMapping
    public List<Lot> getAll() {
        return lotService.getAll();
        //return userService.getAll();
    }

    @GetMapping("{lotId}")
    public LotResponse getOne(@PathVariable Integer lotId) {
        return lotService.getById(lotId);
        //return userService.getAll();
    }

    @GetMapping("/sort")
    public PagedResponse<LotResponse> getAll(@RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
                                          @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
        return lotService.getAll(page, size);
    }

    @PostMapping
    public ResponseEntity<?> Create(@Valid @RequestBody LotRequest lotRequest) {

        Boolean isCreated = lotService.create(lotRequest);

        if(isCreated){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Lot cree avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la creation du lot"));
        }

    }

    @PostMapping("{lotId}/attestations")
    public ResponseEntity<?> addAttestationToLot(@PathVariable Integer lotId,  @Valid @RequestBody List<Attestation> attestations) {

        Boolean isCreated = lotService.addAttestationToLot(lotId, attestations);

        if(isCreated){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "attestation ajoutee avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de l'ajout de l'attestation"));
        }

    }

    @GetMapping("{lotId}/generate")
    public String generateAttestation(@PathVariable Integer lotId, @RequestParam(value = "type") String type, @RequestParam(value = "numero") Integer numero){
       return jasperService.generateAttestationByLotId(lotId, numero, type);
    }

    @GetMapping("dashboard")
    public Dashboard dashboard(){
        return new Dashboard(attestationRepository.count(), lotRepository.count(), attestationRepository.count(), lotRepository.count());
    }



}
