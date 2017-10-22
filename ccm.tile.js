/* 
 * The MIT License
 *
 * Copyright 2017 Moritz Kemp <moritz at kemp-thelen.de>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(){
    var component = {
        name : "tile",
        ccm : "https://akless.github.io/ccm/ccm.js",
        config: {
            "tiles":[],
            "singelTileStyle":["ccm.load", "./tile-default.css"],
            "overallStyle": ["ccm.load", "./overall-default.css"],
            "order": "asc",
            "html":{
                "container":{
                    "tag": "div",
                    "class": "container"
                },
                "tile": {
                    "tag" : "div",
                    "class": "tile",
                    "inner": [
                        //icon, headline and subline append here
                    ]
                },
                "icon": {
                    "tag":"img",
                    "class":"icon"
                },
                "headline": {
                    "tag":"div",
                    "class":"headline"
                },
                "subline": {
                    "tag":"div",
                    "class":"subline"
                }
            }
        },
        Instance: function(){
            const self = this;
            let my = {};
            
            this.ready = function( callback ){
                my = self.ccm.helper.privatize(self);
                if(callback) callback();
            };
            
            this.start = function( callback ){
                render();
                if(callback) callback();  
            };
            
            /* --- Public functions --- */
            
            // Add and render a new tile
            this.addTile = function( tile, callback ){
                let container = self.element.querySelector('.container');
                let tileElem = createTile(tile);
                if(my.order === "asc")
                    container.appendChild(tileElem);
                if(my.order === "desc")
                    container.insertBefore(tileElem, container.childNodes[0]);
                my.tiles.push(tile);
                if(callback) callback();
            };
            
            // Set an action of a existing tile by its ID
            // Action should be a function ref, otherwise ignored later
            this.setAction = function( tileID, action ){
                let i=0;
                while(i<my.tiles.length){
                    if(my.tiles[i].id === tileID)
                        my.tiles[i].action = action;
                    i++;
                }
                let tile = self.element.querySelector('.tile-id-'+tileID);
                if(tile)
                    tile.action = action;
            };
            
            /* --- Private functions --- */
            
            const render = function(){
                let container = self.ccm.helper.html(my.html.container);
                let newTile = {};
                
                if(my.order === "asc") {
                    for(let i=0; i<my.tiles.length; i++){
                        newTile = createTile( my.tiles[i] );
                        container.appendChild(newTile);
                    }
                }
                
                if(my.order === "desc") {
                    for(let i=my.tiles.length-1; i>=0; i--){
                        newTile = createTile( my.tiles[i] );
                        container.appendChild(newTile);
                    }
                }
                self.element.html = '';
                self.element.appendChild(container);
            };
            
            const createTile = function( tileData ){
                let textNode = {};
                let iconElem = {};
                let headlineElem = {};
                let sublineElem = {};
                let newTile = self.ccm.helper.html(my.html.tile);
                if(tileData.icon){
                    iconElem = self.ccm.helper.html( my.html.icon );
                    iconElem.src = tileData.icon;
                    newTile.appendChild(iconElem);
                }
                if(tileData.headline){
                    headlineElem = self.ccm.helper.html(my.html.headline);
                    textNode = document.createTextNode(tileData.headline);
                    headlineElem.appendChild(textNode);
                    newTile.appendChild(headlineElem);
                }
                if(tileData.subline){
                    sublineElem = self.ccm.helper.html(my.html.subline);
                    textNode = document.createTextNode(tileData.subline);
                    sublineElem.appendChild(textNode);
                    newTile.appendChild(sublineElem);
                }
                if(tileData.id){
                    newTile.classList.add('tile-id-'+tileData.id);
                }
                newTile.action = tileData.action;
                newTile.addEventListener('click', onTileClick);
                return newTile;
            };
            
            const onTileClick = function( event ){
                if(typeof(event.target.action) === 'function')
                    event.target.action();
            };
        }
    };
    
    //The following code gets the framework and registers component from above
    function p(){window.ccm[v].component(component);}
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}} 
}());

