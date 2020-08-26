package com.df.mediaassur.model;

import com.df.mediaassur.model.audit.UserDateAudit;

import javax.persistence.*;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */
@Entity
@Table(name = "assureurs")
public class Assureur extends UserDateAudit {
    @Id
    @GeneratedValue(generator = "assureurs_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "assureurs_id_seq",
            sequenceName = "assureurs_id_seq",
            allocationSize = 50
    )
    private Integer id;
    private String name;
    private String description;
    private String address;

    public Assureur() {

    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
