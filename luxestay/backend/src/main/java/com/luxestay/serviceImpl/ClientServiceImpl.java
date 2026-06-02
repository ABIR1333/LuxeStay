package com.luxestay.serviceImpl;

import com.luxestay.entity.Client;
import com.luxestay.exception.ResourceNotFoundException;
import com.luxestay.repository.ClientRepository;
import com.luxestay.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ClientServiceImpl implements ClientService {

    @Autowired private ClientRepository clientRepository;

    @Override public List<Client> getAll() { return clientRepository.findAll(); }

    @Override
    public Client getById(Long id) {
        return clientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Client not found: " + id));
    }

    @Override public Client create(Client client) { return clientRepository.save(client); }

    @Override
    public Client update(Long id, Client updated) {
        Client c = getById(id);
        c.setFirstName(updated.getFirstName());
        c.setLastName(updated.getLastName());
        c.setEmail(updated.getEmail());
        c.setPhone(updated.getPhone());
        c.setAddress(updated.getAddress());
        c.setCity(updated.getCity());
        c.setCountry(updated.getCountry());
        c.setIdCard(updated.getIdCard());
        return clientRepository.save(c);
    }

    @Override
    public void delete(Long id) { clientRepository.deleteById(getById(id).getId()); }

    @Override
    public List<Client> search(String query) {
        return clientRepository
            .findByLastNameContainingIgnoreCaseOrFirstNameContainingIgnoreCase(query, query);
    }
}
