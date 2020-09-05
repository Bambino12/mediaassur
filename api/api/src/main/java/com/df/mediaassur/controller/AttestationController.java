package com.df.mediaassur.controller;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.payload.ApiResponse;
import com.df.mediaassur.payload.LotRequest;
import com.df.mediaassur.payload.PagedResponse;
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
@RequestMapping("/v1/attestations")
public class AttestationController {

    @Autowired
    AttestationRepository attestationRepository;

    @Autowired
    JasperService jasperService;

    private static final Logger logger = LoggerFactory.getLogger(AttestationController.class);


    @GetMapping
    public List<Attestation> getAll() {
        return attestationRepository.findAll();
        //return userService.getAll();
    }

    @GetMapping("{attestationId}")
    public Attestation getOne(@PathVariable Integer attestationId) {
        return attestationRepository.findById(attestationId).get();
        //return userService.getAll();
    }


    @PostMapping
    public ResponseEntity<?> Create(@Valid @RequestBody Attestation attestation) {

        attestationRepository.save(attestation);

        if(attestation.getId() != null){
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Attestation cree avec succes"));
        }else{
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la creation du lot"));
        }

    }


    @DeleteMapping("{attestationId}")
    public ResponseEntity<?> Delete(@PathVariable Integer attestationId) {

        try {
            attestationRepository.deleteById(attestationId);
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS, true, "Attestation supprimee avec succes"));
        }catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(AppConstants.STATUS_CODE_ERROR, false, "Une erreur est survenue lors de la suppression de l'attestation"));
        }

    }


    @GetMapping("{attestationId}/generate")
    public String generateAttestation(@PathVariable Integer attestationId, @RequestParam(value = "type") String type, @RequestParam(value = "numero") Integer numero){
        return jasperService.generateOneAttestation(attestationId, numero, type);
    }


    @PostMapping(value = "/updateAttestations")
    public void update(@RequestBody Attestation attestation){
        attestationRepository.save(attestation);
    }
    //Update Marque
//    @PostMapping(value = "/upd")
//    public boolean update(@RequestBody Attestation attestation) {
//        return attestationRepository.update(attestation);
//    }






}
