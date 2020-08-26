package com.df.mediaassur.model;

import com.df.mediaassur.model.audit.UserDateAudit;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */
@Entity
@Table(name = "assures")
public class Assure extends UserDateAudit {
    @Id
    @GeneratedValue(generator = "assures_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "assures_id_seq",
            sequenceName = "assures_id_seq",
            allocationSize = 50
    )
    private Integer id;
    private String name;
    private String description;

    public Assure() {

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
}
