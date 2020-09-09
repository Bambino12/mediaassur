package com.df.mediaassur.payload;

import com.df.mediaassur.model.Lot;
import com.df.mediaassur.model.Marque;

import java.util.List;

public class MarqueResponse extends Marque {
    private String creator;
    private List<Lot> lots;


    public MarqueResponse(){

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