// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ResourceFormatterService {
// //
//   format(url: string, type: string): string {
//     if (!url) return '';
    
//     // 1. Lógica YouTube
//     if (url.includes('youtube.com') || url.includes('youtu.be')) {
//       const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//       const match = url.match(regExp);
//       const videoId = (match && match[2].length === 11) ? match[2] : null;
//       if (videoId) {
//         // Añadimos 'rel=0' y 'iv_load_policy=3' para una interfaz más limpia
//         return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3`;
//       }
//     } 
    
//     // // 2. Lógica PDF
//     // if (type === 'PDF' || url.toLowerCase().endsWith('.pdf')) {
//     //   if (url.includes('localhost') || url.startsWith('/') || url.includes(window.location.hostname)) {
//     //     /**
//     //      * view=FitH: Ajusta al ancho de la página (elimina márgenes laterales vacíos)
//     //      * toolbar=1: Recomendado dejarla en 1 para que el usuario pueda imprimir/descargar
//     //      * navpanes=0: Oculta el panel lateral de miniaturas que quita espacio
//     //      */
//     //     return `${url}#view=FitH&navpanes=0&toolbar=1`;
//     //   }
//     //   // Visor de Google para PDFs externos
//     //   return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
//     // }

//     // 2. Lógica PDF
//     if (type === 'PDF' || url.toLowerCase().endsWith('.pdf')) {
//       // Caso A: Archivos locales (no necesitan a Google)
//       if (url.includes('localhost') || url.startsWith('/') || url.includes(window.location.hostname)) {
//         return `${url}#view=FitH&navpanes=0&toolbar=1`;
//       }
      
//       // Caso B: Archivos externos (Google actúa como puente/proxy)
//       // Cambiamos 'viewer' por 'gview' para mayor compatibilidad
//       const encodedUrl = encodeURIComponent(url);
//       return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
//     }

//     // 3. Lógica Video Directo (MP4, WebM)
//     // Devolvemos la URL tal cual para que el navegador la cargue nativamente en el iframe
//     if (type === 'VIDEO' || url.toLowerCase().endsWith('.mp4')) {
//       return url;
//     }

//     return url;
//   }  
// }


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ResourceFormatterService {

  format(url: string, type: string): string {
    if (!url) return '';
    
    const cleanUrl = url.trim();
    const lowerUrl = cleanUrl.toLowerCase();
    const lowerType = (type || '').toLowerCase();

    // 1. Lógica YouTube
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = cleanUrl.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3`;
      }
    }

    // 2. Lógica Google Drive (NUEVO: Para enlaces como el de la WebQuest)
    if (lowerUrl.includes('drive.google.com')) {
      // Convertimos el enlace de 'view' a 'preview' para que sea incrustable
      if (lowerUrl.includes('/view')) {
        return cleanUrl.replace(/\/view.*$/, '/preview');
      }
      return cleanUrl;
    }
    
    // 3. Lógica PDF
    // Usamos .includes('.pdf') en lugar de .endsWith para capturar URLs con parámetros
    // 3. Lógica PDF mejorada
    // Añadimos una validación extra para tipos que vienen de BD como 'PDF'
    if (lowerType === 'pdf' || lowerUrl.includes('.pdf') || lowerUrl.includes('/pdf')) {
      
      // Caso A: Locales
      if (lowerUrl.includes('localhost') || cleanUrl.startsWith('/') || lowerUrl.includes(window.location.hostname)) {
        return `${cleanUrl}#view=FitH&navpanes=0&toolbar=1`;
      }
      
      // Caso B: Externos (Google GView)
      // Usamos cleanUrl para asegurar que no haya espacios invisibles
      const encodedUrl = encodeURIComponent(cleanUrl);
      return `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;
    }

    // 4. Lógica Video Directo (MP4, WebM)
    if (lowerType === 'video' || lowerUrl.endsWith('.mp4')) {
      return cleanUrl;
    }

    // 5. Soporte para Office (Word, Excel)
    const officeExts = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    if (officeExts.some(ext => lowerUrl.endsWith(ext))) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
    }

    return cleanUrl;
  }   
}



// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ResourceFormatterService {

//   format(url: string, type: string): string {
//     console.log('1. URL ORIGINAL RECIBIDA:', url); // <-- LOG DE ENTRADA
//     if (!url) return '';
    
//     let result = url; // Variable para guardar el resultado antes de enviarlo

//     // 1. Lógica YouTube
//     if (url.includes('youtube.com') || url.includes('youtu.be')) {
//       const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//       const match = url.match(regExp);
//       const videoId = (match && match[2].length === 11) ? match[2] : null;
//       if (videoId) {
//         result = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin}&iv_load_policy=3`;
//       }
//     } 
    
//     // 2. Lógica PDF
//     else if (type === 'PDF' || url.toLowerCase().endsWith('.pdf')) {
//       if (url.includes('localhost') || url.startsWith('/') || url.includes(window.location.hostname)) {
//         result = `${url}#view=FitH&navpanes=0&toolbar=1`;
//       } else {
//         // CAMBIO IMPORTANTE: Usamos gview que es más moderno que viewer
//         result = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
//       }
//     }

//     // 3. Lógica Video Directo
//     else if (type === 'VIDEO' || url.toLowerCase().endsWith('.mp4')) {
//       result = url;
//     }

//     console.log('2. URL TRANSFORMADA (SALIDA):', result); // <-- LOG DE SALIDA
//     return result;
//   }   
// }