import { Injectable } from '@angular/core';
import { ICONS } from '../models/svg-icons/icons';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SvgIconsService {

  constructor(private iconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {
    this.registerIcons();
  }

  registerIcons() {
    ICONS.forEach(icon => {
      this.iconRegistry.addSvgIconLiteral(icon.iconName, this.sanitizer.bypassSecurityTrustHtml(icon.literal));
    });
  }
}
