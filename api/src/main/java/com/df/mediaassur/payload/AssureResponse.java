package com.df.mediaassur.payload;

import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.model.Lot;

import java.util.List;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
public class AssureResponse extends Assure {
    private String creator;
    private List<Lot> lots;


    public AssureResponse(){

    }



    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public List<Lot> getLots() {
        return lots;
    }

    public void setLots(List<Lot> lots) {
        this.lots = lots;
    }
}
