package demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import demo.model.Account;
import demo.services.AccountService;

@RestController
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RequestMapping(method = RequestMethod.GET)
    public Page<Account> list(Pageable pageable) {
        return accountService.list(pageable);
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> create(@RequestBody Account account, UriComponentsBuilder uriBuilder) {

        final Account saved = accountService.save(account);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        RequestMapping rm = getClass().getAnnotation(RequestMapping.class);
        headers.add("Location", uriBuilder.path(rm.value()[0] + "/" + saved.getId()).build().toUriString());

        return new ResponseEntity<Object>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@RequestBody Account account, @PathVariable("id") Long id) {

        account.setId(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        if (accountService.findOne(id) == null) {
            return new ResponseEntity<Object>(headers, HttpStatus.NOT_FOUND);
        } else {
            accountService.update(account);
            return new ResponseEntity<Object>(headers, HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {

        if (accountService.findOne(id) == null) {
            return new ResponseEntity<Object>(HttpStatus.NOT_FOUND);
        } else {
            accountService.delete(id);
            return new ResponseEntity<Object>(HttpStatus.OK);
        }
    }

}
