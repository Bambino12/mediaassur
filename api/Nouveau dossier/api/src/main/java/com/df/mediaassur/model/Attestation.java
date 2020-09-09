package com.df.mediaassur.model;


import com.df.mediaassur.model.audit.UserDateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;


@Entity
@Table(name = "attestations")
public class Attestation extends UserDateAudit {

    @Override
    public String toString() {
        return "Attestation{" +
                "id=" + id +
                ", lotId=" + lotId +
                ", numeroJaune='" + numeroJaune + '\'' +
                ", numeroCedeao='" + numeroCedeao + '\'' +
                ", assure='" + assure + '\'' +
                ", marque='" + marque + '\'' +
                ", immatriculation='" + immatriculation + '\'' +
                ", datedebut='" + datedebut + '\'' +
                ", datefin='" + datefin + '\'' +
                ", immatriculation='" + immatriculation + '\'' +
                ", usage='" + usage + '\'' +
                ", genre='" + genre + '\'' +
                ", statusJaune=" + statusJaune +
                ", statusCedeao=" + statusCedeao +
                '}';
    }

    @Id
    @GeneratedValue(generator = "attestations_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "attestations_id_seq",
            sequenceName = "attestations_id_seq",
            allocationSize = 50
    )
    private Integer id;

    private Integer lotId;

    private Integer numeroJaune;

    private Integer numeroCedeao;

    private String numeroPolice;

    private String assure;

    private String marque;

    private String immatriculation;

    private  String description;

    private Date datedebut;

    private Date datefin;

    private String usage;

    private String genre;

    private String profession;

    private Short statusJaune;

    private Short statusCedeao;

    public Attestation() {
    }

    public Attestation(Integer lotId, Integer numeroJaune, Integer numeroCedeao, String numeroPolice, String assure, String marque, String immatriculation,
                       String description,Date datedebut, Date datefin, String usage, String genre, String profession, Short statusJaune, Short statusCedeao) {
        this.lotId = lotId;
        this.numeroJaune = numeroJaune;
        this.numeroCedeao = numeroCedeao;
        this.numeroPolice = numeroPolice;
        this.assure = assure;
        this.marque = marque;
        this.immatriculation = immatriculation;
        this.description = description;
        this.datedebut = datedebut;
        this.datefin = datefin;
        this.genre = genre;
        this.profession = profession;
        this.statusJaune = statusJaune;
        this.statusCedeao = statusCedeao;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getImmatriculation() {
        return immatriculation;
    }

    public void setImmatriculation(String immatriculation) {
        this.immatriculation = immatriculation;
    }

    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getAssure() {
        return assure;
    }

    public void setAssure(String assure) {
        this.assure = assure;
    }

    public Integer getLotId() {
        return lotId;
    }

    public void setLotId(Integer lotId) {
        this.lotId = lotId;
    }

    public String getProfession() {
        return profession;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDatedebut() {
        return datedebut;
    }

    public void setDatedebut(Date datedebut) {
        this.datedebut = datedebut;
    }

    public Date getDatefin() {
        return datefin;
    }

    public void setDatefin(Date datefin) {
        this.datefin = datefin;
    }


    public void setProfession(String profession) {
        this.profession = profession;
    }

    public String getNumeroPolice() {
        return numeroPolice;
    }

    public void setNumeroPolice(String numeroPolice) {
        this.numeroPolice = numeroPolice;
    }

    public Integer getNumeroJaune() {
        return numeroJaune;
    }

    public void setNumeroJaune(Integer numeroJaune) {
        this.numeroJaune = numeroJaune;
    }

    public Integer getNumeroCedeao() {
        return numeroCedeao;
    }

    public void setNumeroCedeao(Integer numeroCedeao) {
        this.numeroCedeao = numeroCedeao;
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
