package com.df.mediaassur.payload;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;

import java.util.Date;
import java.util.List;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
public class LotRequest extends Lot {

    public LotRequest(Integer assureId, Integer assureurId, Integer marqueId, String numeroPolice, Date startDate, Date endDate, String fileName, Short statusJaune, Short statusCedeao,  List<Attestation> attestations) {
        super(assureId, assureurId, numeroPolice, startDate, endDate, fileName, statusJaune, statusCedeao);
        this.attestations = attestations;
    }

    private List<Attestation> attestations;

    public LotRequest(List<Attestation> attestations) {
        super();
        this.attestations = attestations;
    }

    public List<Attestation> getAttestations() {
        return attestations;
    }

    public void setAttestations(List<Attestation> attestations) {
        this.attestations = attestations;
    }

}
