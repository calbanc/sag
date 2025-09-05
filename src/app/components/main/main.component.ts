import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';  
import { DatePickerModule } from 'primeng/datepicker';
import { dataModel } from './dataModel';
import { MainService } from './main.service';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastModule } from 'primeng/toast';
@Component({  
  selector: 'app-main',
  imports: [
    TableModule,
    ToastModule,
    ToolbarModule, ButtonModule, AvatarModule, TooltipModule, SpeedDialModule, FormsModule, SelectModule, ToggleButtonModule,DatePickerModule, ConfirmDialogModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export default class MainComponent implements OnInit{
  @ViewChild('dt') dt!: Table;

  username: string = '';
  selectedMonth: string = '';
  showBottomSheet: boolean = false;
  programaOptions: Opciones[] = [];
  actividadOptions: Opciones[] = [];
  checked: boolean = false;

  data:Sag[] | []=[];

  datosmodel:dataModel|undefined;
  
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
      command: () => this.exportarExcel()
    },
    
  ];

  constructor(
    private router: Router,
    private sagService: MainService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.datosmodel=new dataModel(localStorage.getItem('username')!,"",""  ,"","","","","",false);
  }

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
      console.log('Buscar elementos');
    console.log(this.selectedMonth);
      this.datosmodel!.fecha=this.selectedMonth;
    this.sagService.getdatabymonthyear(this.datosmodel!).subscribe(
      response=>{
        if(response.status=="success"){
          this.data=response.sag;
          
        }
      },error=>{
        console.log(error);
      }
    );

    
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
    this.datosmodel!.fecha=this.formatDateToDDMMYYYY(this.datosmodel!.fecha);
    this.datosmodel!.hora_inicio=this.formatTimeToHHMM(this.datosmodel!.hora_inicio);
    this.datosmodel!.hora_termino=this.formatTimeToHHMM(this.datosmodel!.hora_termino);
    
    console.log('Guardar formulario:', this.datosmodel  );

    this.sagService.save(this.datosmodel!).subscribe(
      response=>{
        console.log(response);  
      },error=>{
        console.log(error);
      }
    );



    // Aquí puedes agregar la lógica para guardar los datos
    this.onCloseBottomSheet();
  }
  formatDateToDDMMYYYY(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day} `;
  }

  formatTimeToHHMM(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
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
    this.datosmodel=new dataModel(localStorage.getItem('username')!,"",""  ,"","","","","",false);
  }

 

  calculateTimeDifference(startTime: string, endTime: string): string {
    if (!startTime || !endTime) return '-';
    
    try {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      let diffHours = endHours - startHours;
      let diffMinutes = endMinutes - startMinutes;
      
      if (diffMinutes < 0) {
        diffHours--;
        diffMinutes += 60;
      }
      
      // Handle negative time difference (overnight)
      if (diffHours < 0) {
        diffHours += 24;
      }
      
      return `${diffHours.toString().padStart(2, '0')}:${diffMinutes.toString().padStart(2, '0')}`;
    } catch (e) {
      console.error('Error calculating time difference:', e);
      return '-';
    }
  }

  exportarExcel() {
    if (!this.dt) {
      console.error('No se pudo acceder a la tabla');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo acceder a los datos de la tabla'
      });
      return;
    }
    
    const rows = (this.dt.filteredValue || this.dt.value || []) as any[];

    // Mapea a columnas legibles y añade la columna calculada:
    const hoja = rows.map((c) => ({
      'Fecha': c.fecha,
      'Hora Inicio': c.hora_inicio,
      'Hora Término': c.hora_termino,
      'Horas Trabajadas': this.calculateTimeDifference(c.hora_inicio, c.hora_termino),
      'Programa': c.programa,
      'Actividad': c.actividad,
      'SPS': c.sps,
      'Auto': c.auto === 1 ? 'SI' : 'NO',
      'Observación': c.observacion,
    }));

    // Crea workbook/worksheet:
    const ws = XLSX.utils.json_to_sheet(hoja);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    

    // Escribe y descarga:
    const bin = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const nombre = `reporte_${new Date().toISOString().slice(0, 10)}.xlsx`;
    saveAs(new Blob([bin], { type: 'application/octet-stream' }), nombre);
  }

  confirmDelete(customer: any): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que deseas eliminar este registro?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (!customer || !customer.id) {
          console.error('ID de registro no válido');
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: 'No se pudo identificar el registro a eliminar' 
          });
          return;
        }

        this.sagService.deleteRecord(customer.id).subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.messageService.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: 'Registro eliminado correctamente' 
              });
              // Recargar los datos
              this.onShow();
            } else {
              this.messageService.add({ 
                severity: 'warn', 
                summary: 'Advertencia', 
                detail: response.message || 'No se pudo completar la operación' 
              });
            }
          },
          error: (error: any) => {
            console.error('Error al eliminar el registro:', error);
            this.messageService.add({ 
              severity: 'error', 
              summary: 'Error', 
              detail: 'Ocurrió un error al intentar eliminar el registro' 
            });
          }
        });
      }
    });
  }



}

interface Opciones {
  name: string;
  code: string;
}

/* {
  "rut": "71462409",
  "fecha": "2025-09-05T05:00:00.000Z",
  "hora_inicio": "2025-09-05T17:53:56.640Z",
  "hora_termino": "2025-09-05T17:55:58.507Z",
  "programa": "O",
  "sps": "123123",
  "actividad": "I",
  "observacion": "",
  "auto": true
} */

  export interface Dataresponse {
    status:  string;
    code:    string;
    message: string;
    sag:     Sag[];
}

export interface Sag {
    rut:          string;
    fecha:        Date;
    sps:          string;
    hora_inicio:  string;
    hora_termino: string;
    programa:     string;
    actividad:    string;
    id:           number;
    auto:         number;
}
