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
    public ResponseEntity<String> defaultErrorHandler(ConstraintViolationException e) {
        return new ResponseEntity<String>(e.getConstraintViolations().toString(), HttpStatus.BAD_REQUEST);
    }
}