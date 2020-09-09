package com.df.mediaassur.model;

import com.df.mediaassur.model.audit.UserDateAudit;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by rajeevkumarsingh on 01/08/17.
 */
@Entity
@Table(name = "lots")
public class Lot extends UserDateAudit {

    @Id
    @GeneratedValue(generator = "lots_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "lots_id_seq",
            sequenceName = "lots_id_seq",
            allocationSize = 50
    )
    private Integer id;

    private Integer assureId;

    private Integer assureurId;

    private Integer sNumeroAttestation;

    private String numeroPolice;

    private Date startDate;

    private Date endDate;

    private String fileName;

    private Short statusJaune;

    private Short statusCedeao;

    public Lot() {

    }

    public Lot(Integer assureId, Integer assureurId, String numeroPolice, Date startDate, Date endDate, String fileName) {
        this.assureId = assureId;
        this.assureurId = assureurId;
        this.numeroPolice = numeroPolice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fileName = fileName;
    }

    public Lot(Integer assureId, Integer assureurId, String numeroPolice, Date startDate, Date endDate, String fileName, Short statusJaune, Short statusCedeao) {
        this.assureId = assureId;
        this.assureurId = assureurId;
        this.numeroPolice = numeroPolice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fileName = fileName;
        this.statusJaune = statusJaune;
        this.statusCedeao = statusCedeao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAssureId() {
        return assureId;
    }

    public void setAssureId(Integer assureId) {
        this.assureId = assureId;
    }

    public Integer getAssureurId() {
        return assureurId;
    }

    public void setAssureurId(Integer assureurId) {
        this.assureurId = assureurId;
    }

    public String getNumeroPolice() {
        return numeroPolice;
    }

    public void setNumeroPolice(String numeroPolice) {
        this.numeroPolice = numeroPolice;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getsNumeroAttestation() {
        return sNumeroAttestation;
    }

    public void setsNumeroAttestation(Integer sNumeroAttestation) {
        this.sNumeroAttestation = sNumeroAttestation;
    }

    public Short getStatusJaune() {
        return statusJaune;
    }

    public void setStatusJaune(Short statusJaune) {
        this.statusJaune = statusJaune;
    }

    public Short getStatusCedeao() {
        return statusCedeao;
    }

    public void setStatusCedeao(Short statusCedeao) {
        this.statusCedeao = statusCedeao;
    }
}
