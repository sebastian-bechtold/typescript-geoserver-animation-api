<template>
    <div class="geoserver-animations-list">
        <ul>
            <li v-for="anim in animations" @click="onAnimationClicked(anim, $event)">{{anim.title}}</li>
        </ul>
    </div>
</template>

<script lang="ts">

import { GeoServerAnimationApi } from './GeoServerAnimationApi'

import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'

@Component({})
export default class AnimationsList extends Vue {

    //################# BEGIN Props ###################
    @Prop()
    geoServerUrl: string;
    
    @Prop()
    proxyUrl: string;
    //################# END Props ###################

    private animations: any = [];

    created() {
        var gsanim = new GeoServerAnimationApi(this.geoServerUrl, this.proxyUrl);

        gsanim.loadAnimationsFromAllWorkspaces((result: any) => {

            for (let lg of result) {

                gsanim.loadAnimationAsync(lg.name, lg.name, (animDetailInfo: any) => {
                    this.animations.push(animDetailInfo);
                });
            }
        });
    }

    onAnimationClicked(animation: any, event: MouseEvent) {    
        this.$emit('input', animation);
    }

}
</script>

<style lang="scss">
div.geoserver-animations-list {

ul{
    margin: 0;
    padding:0;
list-style:none;

    > li {
        border-bottom:1px solid #ccc;
        padding:8px;

        &:hover {
            background-color:#eee;
            cursor:pointer;
        }
    }
}

}
</style>