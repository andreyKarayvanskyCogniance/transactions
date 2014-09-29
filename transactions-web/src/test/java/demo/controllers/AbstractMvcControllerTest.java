package demo.controllers;

import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import com.fasterxml.jackson.databind.ObjectMapper;

import demo.Application;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@SpringApplicationConfiguration(classes = Application.class)
@Transactional
public abstract class AbstractMvcControllerTest {

    protected MockMvc mockMvc;

    protected ObjectMapper om = new ObjectMapper();

    @Autowired
    protected WebApplicationContext wac;

    protected abstract String url();

    @Before
    public void setupMvcMock() {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    protected <T> List<T> listJson(Class<T> clazz, Object... urlPaths) throws Exception {
        final MvcResult res = mockMvc.perform(
                get(fullUrl(urlPaths))).andExpect(status().isOk()).andReturn();
        
        return om.readValue(res.getResponse().getContentAsByteArray(),
                om.getTypeFactory().constructCollectionType(List.class, clazz));
    }
    
    protected <T> Long postCreateJson(final T bodyObj, final Object... urlPaths) throws Exception {
        final MvcResult result = postCreateJson(bodyObj, status().isCreated(), urlPaths).andReturn();

        final String locationHeader = result.getResponse().getHeader("Location");

        assertThat(locationHeader, not(isEmptyOrNullString()));

        final String[] paths = locationHeader.split("/");

        final Long entityId = Long.parseLong(paths[paths.length - 1]);
        assertNotNull("Entity Id.", entityId);

        return entityId;
    }

    protected <T> ResultActions postCreateJson(final T bodyObj, ResultMatcher status, final Object... urlPaths)
            throws Exception {

        return mockMvc.perform(
                post(fullUrl(urlPaths)).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bodyObj)))
                .andExpect(status);
    }

    protected <T> ResultActions putUpdateJson(final T bodyObj, ResultMatcher status, final Object... urlPaths)
            throws Exception {

        return mockMvc.perform(
                put(fullUrl(urlPaths)).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(bodyObj)))
                .andExpect(status);
    }

    protected ResultActions deleteJson(ResultMatcher status, final Object... urlPaths) throws Exception {
        return mockMvc.perform(delete(fullUrl(urlPaths))).andExpect(status);
    }

    private String fullUrl(Object... urlPaths) {
        final String addedUrl = Arrays.stream(urlPaths).map(Object::toString).collect(Collectors.joining("/"));

        return url() + addedUrl;
    }
}
