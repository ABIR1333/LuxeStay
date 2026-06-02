package com.luxestay.service;

import com.luxestay.entity.Client;
import java.util.List;

public interface ClientService {
    List<Client> getAll();
    Client getById(Long id);
    Client create(Client client);
    Client update(Long id, Client client);
    void delete(Long id);
    List<Client> search(String query);
}
