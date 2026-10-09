import fs from 'node:fs';
const file='app/home.module.css';
let css=fs.readFileSync(file,'utf8');
css=css.replace(/\.page :global\(\.header-brand>span\)\{[^}]*\}/g,'');
css=css.replace(/\.footerTop :global\(\.logo\)::after\{[^}]*\}/g,'');
css+='\n.page :global(.header-brand),.page :global(.header-brand .logo){width:calc(152 * var(--u));height:calc(85 * var(--u))}\n.footerTop :global(.logo){height:calc(85 * var(--u))}\n@media(max-width:700px){.page :global(.header-brand),.page :global(.header-brand .logo){width:95px;height:53px}.footerTop :global(.logo){height:56px}}\n@media(max-width:360px){.page :global(.header-brand),.page :global(.header-brand .logo){width:82px;height:46px}}\n';
fs.writeFileSync(file,css);
