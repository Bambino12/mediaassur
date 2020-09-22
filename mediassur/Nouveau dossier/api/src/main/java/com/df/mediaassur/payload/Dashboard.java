package com.df.mediaassur.payload;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
public class Dashboard {
    private Long countAttestation;
    private Long countLot;
    private Long countAttestationPrint;
    private Long countLotPrint;

    public Dashboard(Long countAttestation, Long countLot, Long countAttestationPrint, Long countLotPrint) {
        this.countAttestation = countAttestation;
        this.countLot = countLot;
        this.countAttestationPrint = countAttestationPrint;
        this.countLotPrint = countLotPrint;
    }

    public Long getCountAttestation() {
        return countAttestation;
    }

    public void setCountAttestation(Long countAttestation) {
        this.countAttestation = countAttestation;
    }

    public Long getCountLot() {
        return countLot;
    }

    public void setCountLot(Long countLot) {
        this.countLot = countLot;
    }

    public Long getCountAttestationPrint() {
        return countAttestationPrint;
    }

    public void setCountAttestationPrint(Long countAttestationPrint) {
        this.countAttestationPrint = countAttestationPrint;
    }

    public Long getCountLotPrint() {
        return countLotPrint;
    }

    public void setCountLotPrint(Long countLotPrint) {
        this.countLotPrint = countLotPrint;
    }
}
