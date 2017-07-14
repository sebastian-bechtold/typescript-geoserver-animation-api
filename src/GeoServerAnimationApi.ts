// TODO: 3 Use promises

import {GeoServerRestApi} from "../../GeoServerRestApi/src/GeoServerRestApi";

export class GeoServerAnimationApi {

    gsrr: GeoServerRestApi;
   
    constructor(geoserverUrl: URL, proxyUrl : URL, username : string, password : string) {
        this.gsrr = new GeoServerRestApi(geoserverUrl, proxyUrl, username, password);            
    }


    getAnimation(workspace : string, name : string, handler : any) {
        
        let me = this;
        
        console.log("Getting " + workspace + " : " + name);
        
        this.gsrr.getLayerGroup(workspace, name, function(result) {                        

            if (typeof result == "undefined") {
                console.error("Failed to get animation " + workspace + ":" + name);
                return;              
            }
            
            // Attach URL of GeoServer source:
            result.geoServerUrl = me.gsrr.geoserverBaseUrl;
            
            handler(result);
        });
    }


    // getAnimations looks for animation group layers in the passed workspace
    getAnimations(workspace: string, handler : any) {
        
        this.gsrr.getLayerGroups(workspace, function (layerGroups) {
            
            let result = [];

            //###### BEGIN Loop over list of layer groups and filter out those that are animations ######            
            for (let lg of layerGroups.layerGroups.layerGroup) {                                                
                
                if (lg.name.startsWith("anim_")) {
                    result.push(lg);                
                }
            }
            //###### END Loop over list of layer groups and filter out those that are animations ######
            
            handler(result);
        });                
    }
    
    
    // getAnimations2 loops through all workspaces with a name that begins with "anim_" and picks
    // from each of those workspaces the one group layer that has the same name as the workspace.
    getAnimations2(handler : any) {
        
        let me = this;
        
        this.getAnimationWorkspaces(function(workspaces) {                       
            
            let result = [];
            
            let numAnims = workspaces.length;
            let count = 0;
                                    
            for(let ws of workspaces) {
                                              
                me.gsrr.getLayerGroup(ws.name, ws.name, function(lg) {

                    // TODO: 2 What if a request fails?
                    result.push(lg);
                    count++;

                    if (count == numAnims) {
                        console.log("All animations loaded!");
                        handler(result);
                    }
                });
                
            }            
        });
    }
    
    // TODO: 3 Move name filtering to GeoServerRestReader API
    getAnimationWorkspaces(handler : any) {
        
        this.gsrr.getWorkspaces(function (workspaces) {
                                   
            let result = [];
            
            //###### BEGIN Loop over list of workspaces and filter out those that are animations ######            
            for (let ws of workspaces.workspaces.workspace) {
                                                
                if (ws.name.startsWith("anim_")) {
                    result.push(ws);                
                }
            }
            //###### END Loop over list of workspaces and filter out those that are animations ######
                                               
            handler(result);
        });                
    }
}
