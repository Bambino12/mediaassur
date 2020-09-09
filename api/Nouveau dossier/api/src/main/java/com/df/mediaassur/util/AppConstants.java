package com.df.mediaassur.util;

public interface AppConstants {

    String DEFAULT_PAGE_NUMBER = "0";
    String DEFAULT_PAGE_SIZE = "30";
    int MAX_PAGE_SIZE = 50;
    int STATUS_CODE_SUCCESS = 10;
    int STATUS_CODE_ERROR = 20;
    int STATUS_CODE_BAD_CREDENTIALS = 30;
    String FOLDER_EXCEL_UPLOAD = "excels";
    String FOLDER_ATTESTATION_UPLOAD = "attestations";
    String  ATTESTATION_TYPE_JAUNE = "jaune";
    String ATTESTATION_TYPE_CEDEAO = "cedeao";

    Short STATUS_ATTESTATION_NEW = 0;
    Short STATUS_ATTESTATION_GENERATED = 1;
    Short STATUS_ATTESTATION_CANCELED = 2;

    Short STATUS_LOT_NEW = 0;
    Short STATUS_LOT_GENERATED = 1;
    Short STATUS_LOT_CANCELED = 2;
}
