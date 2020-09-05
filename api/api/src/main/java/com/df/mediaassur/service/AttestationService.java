package com.df.mediaassur.service;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.repository.AttestationRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class AttestationService {
    @Autowired
    private AttestationRepository attestationRepository;

//    public void save(Commentaire commentaire){
//        commentaireRepository.save(commentaire);
//    }

    public void update(Attestation attestation){
        attestationRepository.save(attestation);
    }

    public void delete(Integer id){
        attestationRepository.deleteById(id);
    }

//    public List<Commentaire> list(){
//        return commentaireRepository.findAll();
//    }
//
//    public Commentaire byId(Integer id){
//        return commentaireRepository.getOne(id);
//    }
//
//
//    public List<Commentaire> byName(String name){
//        return commentaireRepository.findByName(name);
//    }
}
