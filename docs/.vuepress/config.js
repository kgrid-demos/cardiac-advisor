module.exports = {
  base: '/cardiac-advisor/',
  title: 'Post PCI',
  themeConfig: {
    logo: '/images/kgrid-logo.png',
    repo: 'kgrid-demos/cardiac-advisor',
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Guide', link: '/' },
      // { text: 'Develop', link: '/develop/' },
      { text: 'Post PCI Collection', link: 'https://kgrid-objects.github.io/postpci'},
      { text: 'Online Demo', link: 'https://launch.smarthealthit.org/?auth_error=&fhir_version_1=r2&fhir_version_2=r3&iss=&launch_ehr=1&launch_url=https%3A%2F%2Fdemo.kgrid.org%2Fcardiac-advisor%2Ffhir-app%2Flaunch.html&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sb=&sde=&sim_ehr=1&token_lifetime=15&user_pt=' }
    ],
    search: true,
    searchMaxSuggestions: 10,
    sidebar: 'auto',
    displayAllHeaders: true
  }
}
