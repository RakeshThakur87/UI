// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  host: 'http://localhost:1829/',
  login: 'oauth2/token',
  menu: 'api/menu/GetMenuList',
  application:'api/sso/GetApplicationList/',
  industry:'api/Industry/GetIndustryList',
  industryddllist:'api/Industry/GetDropdown_listAsync',
  industryCategoryList:'api/Industry/GetIndustryCategoryList',
  employeeBranchwiseList:'api/business/GetCompanyWiseBranch',
  InsertIndustry: 'api/Industry/saveData',
  fotgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  fileupload: '/fileupload',
  deleteAttachment: '/filedelete',
  clientSignup: '/client-signup',
  clientId:"e4cytrnZhyrqDRtc0tUwtnmj6CNtMI9sfGAn9ymy",
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
