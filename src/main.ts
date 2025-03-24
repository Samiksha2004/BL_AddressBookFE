import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './address-book/app.module';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
