package com.df.mediaassur.model;


import com.df.mediaassur.model.audit.UserDateAudit;
import com.fasterxml.jackson.annotation.JsonFormat;

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
                ", assureId=" + assureId +
                ", assureurId=" + assureurId +
                ", assureur='" + assureur + '\'' +
                ", assureurAddress='" + assureurAddress + '\'' +
                ", lotId=" + lotId +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", numeroJaune=" + numeroJaune +
                ", numeroCedeao=" + numeroCedeao +
                ", numeroPolice='" + numeroPolice + '\'' +
                ", assure='" + assure + '\'' +
                ", marque='" + marque + '\'' +
                ", immatriculation='" + immatriculation + '\'' +
                ", usage='" + usage + '\'' +
                ", genre='" + genre + '\'' +
                ", profession='" + profession + '\'' +
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

    private Integer assureId;

    private Integer assureurId;

    //
    private String  assureur;

    //
    private String  assureurAddress;

    //
    private String  assureAddress;

    private Integer lotId;

    private Date startDate;

    private Date endDate;

    private Integer numeroJaune;

    private Integer numeroCedeao;

    private String numeroPolice;

    //
    private String assure;

    private String marque;

    private String immatriculation;

    private String usage;

    private String genre;

    //
    private String profession;

    //
    private Short statusJaune;

    //
    private Short statusCedeao;

    public Attestation() {
    }

    public Attestation(Integer lotId, Integer numeroJaune, Integer numeroCedeao, String numeroPolice, String assure, String marque, String immatriculation,
                       String usage, String genre, String profession, Short statusJaune, Short statusCedeao) {
        this.lotId = lotId;
        this.numeroJaune = numeroJaune;
        this.numeroCedeao = numeroCedeao;
        this.numeroPolice = numeroPolice;
        this.assure = assure;
        this.marque = marque;
        this.immatriculation = immatriculation;
        this.usage = usage;
        this.genre = genre;
        this.profession = profession;
        this.statusJaune = statusJaune;
        this.statusCedeao = statusCedeao;
    }

    public Attestation(Integer assureId, Integer assureurId, String assureur, String assureAddress, String assureurAddress, Integer lotId, Date startDate, Date endDate, Integer numeroJaune, Integer numeroCedeao, String numeroPolice, String assure, String marque, String immatriculation, String usage, String genre, String profession, Short statusJaune, Short statusCedeao) {
        this.assureId = assureId;
        this.assureurId = assureurId;
        this.assureur = assureur;
        this.assureurAddress = assureurAddress;
        this.assureAddress = assureAddress;
        this.lotId = lotId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.numeroJaune = numeroJaune;
        this.numeroCedeao = numeroCedeao;
        this.numeroPolice = numeroPolice;
        this.assure = assure;
        this.marque = marque;
        this.immatriculation = immatriculation;
        this.usage = usage;
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

    //@JsonFormat (shape = JsonFormat.Shape.STRING,pattern = "YYYY/MM/DD")
    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    //@JsonFormat (shape = JsonFormat.Shape.STRING,pattern = "YYYY/MM/DD")
    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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

    public String getAssureur() {
        return assureur;
    }

    public void setAssureur(String assureur) {
        this.assureur = assureur;
    }

    public String getAssureurAddress() {
        return assureurAddress;
    }

    public void setAssureurAddress(String assureurAddress) {
        this.assureurAddress = assureurAddress;
    }

    public String getAssureAddress() {
        return assureAddress;
    }

    public void setAssureAddress(String assureAddress) {
        this.assureAddress = assureAddress;
    }
}
