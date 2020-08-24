package com.df.mediaassur.service;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.util.AppConstants;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ExcelService {

   private final int assureColumn = 1;
   private final int marqueColumn = 2;
   private final int immatColumn = 3;
   private final int usageColumn = 4;
   private final int genreColumn = 5;
   private final int anneeColumn = 6;
   private final int cvCuColumn = 7;
   private final int energieColumn = 8;
   private final int placesColumn = 9;
   private final int valeurNeuveColumn = 10;
   private final int valeurvenaleColumn = 11;
   private final int rcColumn = 12;
   private final int defenseRecoursColumn = 13;
   private final int recoursAnticipeColumn = 14;
   private final int incendieColumn = 15;
   private final int volAccessoireColumn = 16;
   private final int dommageColumn = 17;
   private final int assistanceColumn = 18;
   private final int volVolArmeeColumn = 19;
   private final int brisGlaceColumn = 20;
   private final int totalColumn = 21;
   private final int securiteRoutiereColumn = 22;


    public List<Attestation> treateFile() throws IOException {
        String fileLocation = "D:\\DIGIN\\Media Assur\\docs\\logiciel_attestation.xlsx";
        return getAttestations(fileLocation);
    }

    public List<Attestation> treateFile(String excelFilePath) throws IOException {
        return getAttestations(excelFilePath);
    }

    private List<Attestation> getAttestations(String fileLocation) throws IOException {
        FileInputStream file = new FileInputStream(new File(fileLocation));
        Workbook workbook = new XSSFWorkbook(file);
        Sheet sheet = workbook.getSheetAt(0);
        List<Attestation> attestations = new ArrayList<>();

        for (Row row : sheet) {
            if(row.getRowNum() > 2) {
                System.out.println(row.getRowNum() + " ===>> " + row.getRowNum());
                Attestation attestation = setAttestationValue(row);
                if (attestation != null) {
                    attestation.setStatusJaune(AppConstants.STATUS_ATTESTATION_NEW);
                    attestation.setStatusCedeao(AppConstants.STATUS_ATTESTATION_NEW);
                    attestations.add(attestation);
                }
            }
        }

        System.out.println("LIGNE GETTING ====>> " + attestations.size());
        System.out.println(attestations.toString());

        return attestations;
    }

    private Attestation setAttestationValue(Row row){
        Attestation attestation = new Attestation();

        try {

            for (Cell cell : row) {
                switch (cell.getColumnIndex()) {
                    case assureColumn:
                        attestation.setAssure((String) getValue(cell, "STRING"));
                        break;

                    case marqueColumn:
                        attestation.setMarque((String) getValue(cell, "STRING"));
                        break;

                    case immatColumn:
                        attestation.setImmatriculation((String) getValue(cell, "STRING"));
                        break;

                    case usageColumn:
                        attestation.setUsage((String) getValue(cell, "STRING"));
                        break;

                    case genreColumn:
                        attestation.setGenre((String) getValue(cell, "STRING"));
                        break;

                    default:
                        break;
                }
            }

        }
        catch (Exception e){
            attestation = null;
            //e.printStackTrace();
        }

        return attestation;
    }

    private Object getValue(Cell cell, String type){
        Object value = null;

        try {

            switch (type) {
                case "STRING":
                    try {
                        value = cell.getStringCellValue();
                    }catch (Exception e){
                        value = cell.getNumericCellValue();
                    }
                    break;

                case "INTEGER":
                    try {
                        value = cell.getNumericCellValue();
                    }catch (Exception e){
                        value = cell.getStringCellValue();
                    }
                    value = Double.valueOf((Double) value).intValue();
                    break;

                default:
                    break;
            }

        }catch (Exception e){
            e.printStackTrace();
        }

        return  value;
    }


}
