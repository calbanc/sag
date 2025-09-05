import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent implements OnInit{
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('LoginComponent ngOnInit');
    
    // Validar si hay un username guardado en localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      console.log('Username encontrado en localStorage:', savedUsername);
      this.username = savedUsername;
      // Opcional: redirigir automáticamente si ya está logueado
      this.router.navigate(['main']);
    } else {
      console.log('No hay username guardado en localStorage');
    }
  }

  onLogin(): void {
    localStorage.setItem('username', this.username);
    this.router.navigate(['main']);
  }

}
