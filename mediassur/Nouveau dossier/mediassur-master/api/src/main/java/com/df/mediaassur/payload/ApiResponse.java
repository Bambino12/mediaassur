package com.df.mediaassur.payload;

/**
 * Created by rajeevkumarsingh on 19/08/17.
 */
public class ApiResponse {
    private int statusCode;
    private Boolean success;
    private String message;

    public ApiResponse(int statusCode,  Boolean success, String message) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
    }


    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
}
