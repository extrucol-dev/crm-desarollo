package com.extrucol.crm.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handlerNotFound(EntityNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        "RESOURCE_NOT_FOUND / Recurso no encontrado"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("errorCode", "VALIDATION_FAILED");

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        response.put("errors", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<ErrorResponse> handleGenericErrors(Exception ex) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
//                new ErrorResponse(LocalDateTime.now(), HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error interno del servidor", "INTERNAL_SERVER_ERROR")
//        );
//    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRuleException(BusinessRuleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                new ErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(), ex.getMessage(), "BUSINESS_RULE_VIOLATION")
        );
    }


    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NoHandlerFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        "Ruta no encontrada o incompleta",
                        "ERR_NO_HANDLER_FOUND"
                )
        );
    }


//    @ExceptionHandler(HttpMessageNotReadableException.class)
//    public ResponseEntity<ErrorResponse> handleParsingErrors(HttpMessageNotReadableException ex) {
//        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
//                new ErrorResponse(LocalDateTime.now(), HttpStatus.BAD_REQUEST.value(),
//                        "El cuerpo de la solicitud no es válido.",
//                        "BAD_REQUEST")
//        );
//    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        ex.getMessage(),
                        "UNAUTHORIZED"
                )
        );
    }
}
