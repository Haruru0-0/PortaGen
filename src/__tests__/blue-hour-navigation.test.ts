import {test} from 'node:test';
import assert from 'node:assert/strict';
const {isWorkspacePath,shouldTransition}=await import(new URL('../lib/blue-hour/navigation-policy.ts',import.meta.url).href);
const base={href:'/dashboard',origin:'https://example.test',currentPath:'/',button:0,metaKey:false,ctrlKey:false,shiftKey:false,altKey:false,download:false,reducedMotion:false};
test('only exact owner routes and dashboard descendants match',()=>{
 for(const path of ['/','/privacy','/auth/login','/auth/signup','/auth/forgot-password','/dashboard','/dashboard/editor/42']) assert.equal(isWorkspacePath(path),true,path);
 for(const path of ['/dashboardish','/auth/sso-callback','/api/portfolio','/portfolio/name/id/home']) assert.equal(isWorkspacePath(path),false,path);
});
test('ordinary owner navigation animates; native variants stay native',()=>{
 assert.equal(shouldTransition(base),true);
 for(const change of [{href:'#features'},{href:'/#features'},{href:'/'},{href:'https://external.test/dashboard'},{href:'/portfolio/name/id'},{href:'/auth/sso-callback'},{button:1},{target:'_blank'},{download:true},{metaKey:true},{ctrlKey:true},{shiftKey:true},{altKey:true},{reducedMotion:true}]) assert.equal(shouldTransition({...base,...change}),false,JSON.stringify(change));
});
