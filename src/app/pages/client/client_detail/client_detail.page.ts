import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../interfaces/client.interface';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client_detail.page.html',
  styleUrls: ['./client_detail.page.scss'],
})
export class ClientDetailPage implements OnInit {
  mode: 'view' | 'edit' = 'view';
  clientId: number = 0;
  clientForm: FormGroup;
  client: Client | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private clientService: ClientService
  ) {
    this.clientForm = this.fb.group({
      alias: ['', [Validators.required]],
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
  }

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (this.route.snapshot.url[0].path === 'add') {
      this.mode = 'edit';
    } else if (idParam) {
      this.clientId = Number(idParam);
      this.mode = this.route.snapshot.url[1].path as 'view' | 'edit';

      if (this.clientId) {
        const client = await this.clientService.getClientById(this.clientId);
        if (client) {
          this.client = client;
          this.loadClientData();
        }
      }
    }
  }

  loadClientData() {
    if (this.client) {
      this.clientForm.patchValue(this.client);
    }
  }

  async saveClient() {
    if (this.clientForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    let clientData = this.clientForm.value;

    if (this.clientId) {
      await this.clientService.updateClient({ id: this.clientId, ...clientData });
    } else {
      const createdClient = await this.clientService.addClient(clientData);
      if (createdClient.id !== undefined) {
        this.clientId = createdClient.id;
      } else {
        console.error('El objeto creado no contiene un ID.');
        alert('Hubo un problema al crear el cliente. Por favor, intenta de nuevo.');
        return;
      }
    }

    this.router.navigate(['/client']);
  }
}