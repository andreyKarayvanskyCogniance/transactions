package demo.controllers;

import static java.text.MessageFormat.format;

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

import demo.model.Transaction;
import demo.services.TransactionService;

@RestController
@RequestMapping("/account/{accountId}/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @RequestMapping(method = RequestMethod.GET)
    public Page<Transaction> list(@PathVariable Long accountId, Pageable pageable) {
        return transactionService.findByAccountId(accountId, pageable);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public ResponseEntity<Transaction> findOne(@PathVariable Long accountId, @PathVariable Long id) {

        final HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        final Transaction transaction = transactionService.findOne(accountId, id);
        
        if (transaction == null) {
            return new ResponseEntity<Transaction>(headers, HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<Transaction>(transaction, headers, HttpStatus.OK);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> create(@PathVariable Long accountId, @RequestBody Transaction transaction,
            UriComponentsBuilder uriBuilder) {

        final Transaction saved = transactionService.save(accountId, transaction);

        final HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        headers.add("Location", uriBuilder.path(format("/account/{0}/transaction/{1}", accountId, saved.getId()))
                .build().toUriString());

        return new ResponseEntity<Object>(headers, HttpStatus.CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable Long accountId, @RequestBody Transaction transaction,
            @PathVariable Long id) {

        final HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        final Transaction dbTransaction = transactionService.findOne(accountId, id);
        
        if (dbTransaction == null) {
            return new ResponseEntity<Object>(headers, HttpStatus.NOT_FOUND);
        } else {
            transaction.setId(id);
            
            transactionService.update(dbTransaction.getAccount(), transaction);
            return new ResponseEntity<Object>(headers, HttpStatus.OK);
        }
    }

}
