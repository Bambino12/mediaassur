package com.df.mediaassur.payload;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;

import java.util.List;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
public class LotResponse extends Lot {

    private String assureur;
    private String assureurAddress;
    private String assure;
    private String creator;
    private List<Attestation> attestations;


    public LotResponse(){
    }

    public LotResponse(List<Attestation> attestations) {
        this.attestations = attestations;
    }

    public List<Attestation> getAttestations() {
        return attestations;
    }

    public void setAttestations(List<Attestation> attestations) {
        this.attestations = attestations;
    }

    public String getAssureur() {
        return assureur;
    }

    public void setAssureur(String assureur) {
        this.assureur = assureur;
    }

    public String getAssure() {
        return assure;
    }

    public void setAssure(String assure) {
        this.assure = assure;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getAssureurAddress() {
        return assureurAddress;
    }

    public void setAssureurAddress(String assureurAddress) {
        this.assureurAddress = assureurAddress;
    }
}
