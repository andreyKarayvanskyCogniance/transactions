package demo.controllers;

import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlerController {

    public static final String DEFAULT_ERROR_VIEW = "error";

    @ExceptionHandler(value = {ConstraintViolationException.class})
    public ResponseEntity<String> constraintViolationErrorHandler(ConstraintViolationException e) {
        return new ResponseEntity<String>(e.getConstraintViolations().toString(), HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(value = {IllegalArgumentException.class})
    public ResponseEntity<String> illegalArgumentErrorHandler(IllegalArgumentException e) {
        return new ResponseEntity<String>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

}