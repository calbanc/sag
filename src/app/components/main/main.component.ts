import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';  

@Component({  
  selector: 'app-main',
  imports: [ToolbarModule, ButtonModule, AvatarModule, TooltipModule, SpeedDialModule, FormsModule, SelectModule, ToggleButtonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent implements OnInit{
  username: string = '';
  selectedMonth: string = '';
  showBottomSheet: boolean = false;
  programaOptions: Opciones[] = [];
  actividadOptions: Opciones[] = [];
  checked: boolean = false;
  
  // Form data for the bottom sheet
  formData = {
    selectedDate: '',
    sps: '',
    programa: '',
    actividad: '',
    horaInicio: null,
    horaTermino: null,
    auto: false,
    observation: ''
  };


  
  speedDialItems = [
    {
      icon: 'pi pi-plus',
      tooltip: 'Agregar',
      command: () => this.onAdd()
    },
    {
      icon: 'pi pi-file-excel',
      tooltip: 'EXPORTAR',
      command: () => this.onSearch()
    },
    
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log('MainComponent ngOnInit');
    
    // Obtener el username del localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
      this.username = savedUsername;
    } else {
      // Si no hay username, redirigir al login
      this.router.navigate(['login']);
    }

    this.programaOptions = [
      { name: 'ORIGEN', code: 'O' },
      { name: 'USDA', code: 'U' },
      { name: 'MAPRO', code: 'M' },
      { name: 'FORESTAL', code: 'F' }
    ];
    
    this.actividadOptions = [
      { name: 'INSPECCION CODIGO', code: 'I' },
    { name: 'MUESTREO CODIGO', code: 'M' },
    { name: 'DESPACHO CODIGO', code: 'D' },
    { name: 'TRATAMIENTO CODIGO', code: 'T' },
    { name: 'OTRAS EN PLANTA', code: 'R' },
    { name: 'SITIO TRANSFERENCIA', code: 'ST' },
    { name: 'ACTIVIDADES OFICINA', code: 'OF' },
    { name: 'SUPERVISION', code: 'S' },
    { name: 'VERIFICACION EN PUNTOS DE SALIDA', code: 'V' },
    { name: 'COSTADO DE NAVE', code: 'CN' },
    { name: 'INSPECCION DE LOSA', code: 'IL' },
    { name: 'PREPARACION DE CARGA', code: 'PC' }
    ];

    
  }

  onLogout(): void {
    // Limpiar localStorage y redirigir al login
    localStorage.removeItem('username');
    this.router.navigate(['login']);
  }

  onShow(): void {
    if (this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-');
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const monthName = monthNames[parseInt(month) - 1];
      
      console.log('Mostrar datos para:', monthName, year, '(mes:', month, ', año:', year, ')');
      // Aquí puedes agregar la lógica para mostrar los datos del mes/año seleccionado
    }
  }

  onAdd(): void {
    console.log('Agregar nuevo elemento');
    this.showBottomSheet = true;
  }

  onCloseBottomSheet(): void {
    this.showBottomSheet = false;
    this.resetForm();
  }

  onSaveForm(): void {
    console.log('Guardar formulario:', this.formData);
    // Aquí puedes agregar la lógica para guardar los datos
    this.onCloseBottomSheet();
  }

  resetForm(): void {
    this.formData = {
      selectedDate: '',
      sps: '',
      programa: '',
      actividad: '',
      horaInicio: null,
      horaTermino: null,
      auto: false,
      observation: ''
    };
  }

  onSearch(): void {
    console.log('Buscar elementos');
    // Aquí puedes agregar la lógica para buscar
  }

  onDownload(): void {
    console.log('Descargar datos');
    // Aquí puedes agregar la lógica para descargar
  }

  onPrint(): void {
    console.log('Imprimir datos');
    // Aquí puedes agregar la lógica para imprimir
  }

}

interface Opciones {
  name: string;
  code: string;
}
