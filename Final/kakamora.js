"use strict";

import * as THREE from 'https://unpkg.com/three@0.120.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.120.1/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'https://unpkg.com/three@0.120.1/examples/jsm/loaders/DRACOLoader.js';

var canvas;
var gl;
var scene, camera, renderer, loader, model, gltf, skeleton;
var controls;
var skeleton;
var t = 0;
var t_0 = 0;
//var T = 400;
var transition = false;
var torsoId = 0;
var leftShoulderId = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightShoulderId = 5;
var rightUpperArmId = 6;
var rightLowerArmId = 7;
var leftHipId = 9;
var leftUpperLegId = 10;
var leftLowerLegId = 11;
var rightHipId = 13;
var rightUpperLegId = 14;
var rightLowerLegId = 15;
var leftHandId = 4;
var rightHandId = 8;
var leftFootId = 12;
var rightFootId = 16;
var disco_mode = false;
//var ok = false;
//var disco_mode = false;
var spotLight_1;
var spotLight_2;
var spotLight_3;

var rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
var torso_translate = new THREE.Vector3(0, 0, 0);
var torso_pos = new THREE.Vector3(0, 0, 0);
//var torso;
var figure = [];
for (var i = 0; i < 17; i++) figure[i] = createNode(null, null, null, null);
//var tween;

//var start = false;
var slider_z, slider_x, slider_y, output_z, output_x, output_y;

function createNode(render, sibling, child1, child2) {
    var node = {
        //transform: transform,
        render: render,
        sibling: sibling,
        child1: child1,
        child2: child2,
    }
    return node;
}
var keyframes = [];

function riseArms(rots) {
    //console.log(rotations);
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]); 
    //console.log(new_rotations);
    new_rotations[leftUpperArmId] = new THREE.Euler(  -45*Math.PI/180,-90*Math.PI/180,rots[leftUpperArmId].z, "XYZ");
    new_rotations[rightUpperArmId] = new THREE.Euler(  45*Math.PI/180,90*Math.PI/180,rots[rightUpperArmId].z, "XYZ");
    new_rotations[leftUpperLegId] = new THREE.Euler(  -70*Math.PI/180,rots[leftUpperLegId].y,rots[leftUpperLegId].z, "XYZ");
    new_rotations[rightUpperLegId] = new THREE.Euler( -70*Math.PI/180,rots[rightUpperLegId].y,rots[rightUpperLegId].z, "XYZ");
    new_rotations[leftLowerLegId] = new THREE.Euler(  0*Math.PI/180,rots[leftLowerLegId].y,rots[leftLowerLegId].z, "XYZ");
    new_rotations[rightLowerLegId] = new THREE.Euler( 0*Math.PI/180,rots[rightLowerLegId].y, rots[rightLowerLegId].z,"XYZ");
    new_rotations[leftFootId] = new THREE.Euler(  -45*Math.PI/180,rots[leftFootId].y,rots[leftFootId].z, "XYZ");
    new_rotations[rightFootId] = new THREE.Euler( -45*Math.PI/180,rots[rightFootId].y, rots[rightFootId].z,"XYZ");
    var new_torso_translate = new THREE.Vector3(torso_translate.x,torso_translate.y+0.05,torso_translate.z);
    var new_torso_pos = new THREE.Vector3(torso_pos.x,torso_pos.y+0.05,torso_pos.z);
    //console.log(rotations == new_rotations);

    t_0 += 10;
    //console.log(new_torso_translate,torso_translate)
    return [t_0, [new_rotations], new_torso_translate, new_torso_pos];
}

function patChest(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    new_rotations[leftUpperArmId] = new THREE.Euler(  rots[leftUpperArmId].x,-20*Math.PI/180,rots[leftUpperArmId].z, "XYZ");
    new_rotations[rightUpperArmId] = new THREE.Euler( rots[rightUpperArmId].x,-20*Math.PI/180,rots[rightUpperArmId].z, "XYZ");
    new_rotations[leftLowerArmId] = new THREE.Euler(  rots[leftLowerArmId].x,60*Math.PI/180,rots[leftLowerArmId].z, "XYZ");
    new_rotations[rightLowerArmId] = new THREE.Euler( rots[rightLowerArmId].x,-30*Math.PI/180,rots[rightLowerArmId].z, "XYZ");
    new_rotations[rightFootId] = new THREE.Euler( rots[rightFootId].x, rots[rightFootId].y,130*Math.PI/180,"XYZ");

    t_0 += 5;
    return [t_0, [new_rotations], torso_translate, torso_pos];
}

function lowArms(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    new_rotations[leftUpperLegId].copy( rotations[leftUpperLegId]);
    new_rotations[rightUpperLegId].copy( rotations[rightUpperLegId]);
    new_rotations[leftLowerLegId].copy( rotations[leftLowerLegId]);
    new_rotations[rightLowerLegId].copy( rotations[rightLowerLegId]);
    new_rotations[leftFootId].copy( rotations[leftFootId]);
    new_rotations[rightFootId].copy( rotations[rightFootId]);
    new_rotations[leftLowerArmId] = new THREE.Euler(  30*Math.PI/180,-40*Math.PI/180,rots[leftLowerArmId].z, "XYZ");
    new_rotations[rightLowerArmId] = new THREE.Euler( rots[rightLowerArmId].x,40*Math.PI/180,rots[rightLowerArmId].z, "XYZ");
    new_rotations[leftUpperArmId].copy(rotations[leftUpperArmId]) ;
    new_rotations[rightUpperArmId].copy(rotations[rightUpperArmId]); 
    new_rotations[leftUpperArmId].x += -20*Math.PI/180; 
    new_rotations[rightUpperArmId].x += 30*Math.PI/180;
    new_rotations[leftUpperArmId].y += 30*Math.PI/180; 
    new_rotations[rightUpperArmId].y += 0*Math.PI/180;
    
    t_0 += 10;
    return [t_0, [new_rotations], torso_translate, torso_pos];

}

function shakeArms(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    var new_keyframes = [];

    new_rotations[leftLowerArmId] = new THREE.Euler(rotations[leftLowerArmId].x,rotations[leftLowerArmId].y,0, "XYZ")
    new_rotations[rightLowerArmId] = new THREE.Euler(rotations[rightLowerArmId].x,rotations[rightLowerArmId].y, 0, "XYZ")
    new_rotations[leftUpperArmId] = new THREE.Euler(-110*Math.PI/180,-30*Math.PI/180,-90*Math.PI/180,"XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(110*Math.PI/180,0*Math.PI/180,-90*Math.PI/180,  "XYZ")
    new_rotations[leftHandId] = new THREE.Euler(  30*Math.PI/180,rots[leftHandId].y,rots[leftHandId].z, "XYZ");
    new_rotations[rightHandId] = new THREE.Euler( -30*Math.PI/180,rots[rightHandId].y, rots[rightHandId].z,"XYZ");
    new_rotations[leftUpperLegId].copy( rotations[leftUpperLegId]);
    new_rotations[rightUpperLegId].copy( rotations[rightUpperLegId]);
    new_rotations[leftLowerLegId].copy( rotations[leftLowerLegId]);
    new_rotations[rightLowerLegId].copy( rotations[rightLowerLegId]);
    new_rotations[leftFootId].copy( rotations[leftFootId]);
    new_rotations[rightFootId].copy( rotations[rightFootId]);

    t_0 += 2;
    new_keyframes.push([t_0, [new_rotations], torso_translate, torso_pos]);

    var new_rotations_1 = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations_1[i].copy(new_rotations[i]);
    new_rotations_1[leftLowerArmId] = new THREE.Euler(new_rotations[leftLowerArmId].x,new_rotations[leftLowerArmId].y+ -20*Math.PI/180,new_rotations[leftLowerArmId].z, "XYZ")
    new_rotations_1[rightLowerArmId] = new THREE.Euler(new_rotations[rightLowerArmId].x,new_rotations[rightLowerArmId].y+ 20*Math.PI/180, new_rotations[rightLowerArmId].z, "XYZ")

    t_0 += 2;
    new_keyframes.push([t_0, [new_rotations_1], torso_translate, torso_pos]);

    var new_rotations_2 = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations_2[i].copy(new_rotations[i]);
    new_rotations_2[leftLowerArmId] = new THREE.Euler(new_rotations_1[leftLowerArmId].x,new_rotations_1[leftLowerArmId].y+ +40*Math.PI/180,new_rotations_1[leftLowerArmId].z, "XYZ")
    new_rotations_2[rightLowerArmId] = new THREE.Euler(new_rotations_1[rightLowerArmId].x,new_rotations_1[rightLowerArmId].y -40*Math.PI/180, new_rotations_1[rightLowerArmId].z, "XYZ")

    t_0 += 2;
    new_keyframes.push([t_0, [new_rotations_2], torso_translate, torso_pos]);
    
    
    //console.log(new_keyframes);
    return new_keyframes;
}

function crossArms(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    
    new_rotations[leftLowerArmId] = new THREE.Euler(rots[leftLowerArmId].x,rots[leftLowerArmId].y,0, "XYZ")
    new_rotations[rightLowerArmId] = new THREE.Euler(rots[rightLowerArmId].x,rots[rightLowerArmId].y, 0, "XYZ")
    new_rotations[leftUpperArmId] = new THREE.Euler(90*Math.PI/180,0*Math.PI/180,-90*Math.PI/180,"XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(-90*Math.PI/180,30*Math.PI/180,-90*Math.PI/180,  "XYZ")
    new_rotations[torsoId] = new THREE.Euler(-rots[torsoId].x - 4*Math.PI/180, rots[torsoId].y + 4*Math.PI/180, rots[torsoId].z, "XYZ")
    //console.log(-rots[torsoId].x);
    t_0 += 10;
    return [t_0, [new_rotations], torso_translate, torso_pos];
}

function coconutShaking(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);

    //var new_torso_translate = new THREE.Vector3(torso_translate.x,torso_translate.y,torso_translate.z+0.05);
    var new_torso_pos = new THREE.Vector3(torso_pos.x,torso_pos.y,torso_pos.z+0.02);
    var new_keyframes = [];
    t_0 +=1
    new_keyframes.push([t_0, [new_rotations], torso_translate, new_torso_pos]);

    //var new_torso_translate_1 = new THREE.Vector3(torso_translate.x,torso_translate.y,torso_translate.z-0.05);
    var new_torso_pos_1 = new THREE.Vector3(torso_pos.x,torso_pos.y,torso_pos.z-0.02);
    t_0+=1
    new_keyframes.push([t_0, [new_rotations], torso_translate, new_torso_pos_1]);
    return new_keyframes;
}
function coconutShakingVertical(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    new_rotations[torsoId] = new THREE.Euler(-45*Math.PI/180, 0, 0, 'XYZ')
    //var new_torso_translate = new THREE.Vector3(torso_translate.x,torso_translate.y,torso_translate.z+0.05);
    var new_torso_pos = new THREE.Vector3(torso_pos.x,torso_pos.y+0.02,torso_pos.z);
    var new_keyframes = [];
    t_0 +=1
    new_keyframes.push([t_0, [new_rotations], torso_translate, new_torso_pos]);

    //var new_torso_translate_1 = new THREE.Vector3(torso_translate.x,torso_translate.y,torso_translate.z-0.05);
    var new_torso_pos_1 = new THREE.Vector3(torso_pos.x,torso_pos.y-0.04,torso_pos.z);
    t_0+=1
    new_keyframes.push([t_0, [new_rotations], torso_translate, new_torso_pos_1]);
    return new_keyframes;
}

function patRightElbow(rots){

    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);

    new_rotations[rightLowerArmId] = new THREE.Euler(rots[rightLowerArmId].x - 130*Math.PI/180,rots[rightLowerArmId].y +Math.PI/2 , rots[rightLowerArmId].z, "XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(rots[rightUpperArmId].x  + 90*Math.PI/180,rots[rightUpperArmId].y - 60*Math.PI/180, rots[rightUpperArmId].z-30*Math.PI/180,  "XYZ")
    new_rotations[leftUpperArmId] = new THREE.Euler(rots[leftUpperArmId].x - 180*Math.PI/180,rots[leftUpperArmId].y - 10*Math.PI/180, rots[leftUpperArmId].z,"XYZ")
    new_rotations[leftLowerArmId] = new THREE.Euler(rots[leftLowerArmId].x-110*Math.PI/180,rots[leftLowerArmId].y,rots[leftLowerArmId].z, "XYZ")
    new_rotations[torsoId] = new THREE.Euler(-rots[torsoId].x + 8*Math.PI/180, rots[torsoId].y - 6*Math.PI/180, rots[torsoId].z, "XYZ")

    t_0 += 10;
    return [t_0, [new_rotations], torso_translate, torso_pos];

}

function hello(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);

    new_rotations[rightLowerArmId] = new THREE.Euler(rots[rightLowerArmId].x - 130*Math.PI/180,rots[rightLowerArmId].y + 110*Math.PI/180 , rots[rightLowerArmId].z, "XYZ")
    new_rotations[torsoId] = new THREE.Euler(-rots[torsoId].x - 4*Math.PI/180, rots[torsoId].y - 10*Math.PI/180, rots[torsoId].z, "XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(rots[rightUpperArmId].x  + 90*Math.PI/180,rots[rightUpperArmId].y -30*Math.PI/180 , rots[rightUpperArmId].z+45*Math.PI/180,  "XYZ")

    t_0 += 10;
    return [t_0, [new_rotations], torso_translate, torso_pos];
}

function jump(rots){
    var new_rotations = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations[i].copy(rots[i]);
    var new_keyframes = [];

    new_rotations[rightLowerArmId] = new THREE.Euler(rots[rightLowerArmId].x + 130*Math.PI/180,rots[rightLowerArmId].y - 110*Math.PI/180 , rots[rightLowerArmId].z, "XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(rots[rightUpperArmId].x  - 90*Math.PI/180,rots[rightUpperArmId].y -30*Math.PI/180 , rots[rightUpperArmId].z-45*Math.PI/180,  "XYZ")
    new_rotations[torsoId] = new THREE.Euler(-rots[torsoId].x + 4*Math.PI/180, rots[torsoId].y - 180*Math.PI/180, rots[torsoId].z, "XYZ")
    new_rotations[rightUpperLegId] = new THREE.Euler( -70*Math.PI/180,rots[rightUpperLegId].y,rots[rightUpperLegId].z, "XYZ");
    new_rotations[leftLowerLegId] = new THREE.Euler(  0*Math.PI/180,rots[leftLowerLegId].y,rots[leftLowerLegId].z, "XYZ");
    new_rotations[rightLowerLegId] = new THREE.Euler( 0*Math.PI/180,rots[rightLowerLegId].y, rots[rightLowerLegId].z,"XYZ");
    new_rotations[leftFootId] = new THREE.Euler(  -45*Math.PI/180,rots[leftFootId].y,rots[leftFootId].z, "XYZ");
    new_rotations[rightFootId] = new THREE.Euler( -45*Math.PI/180,rots[rightFootId].y, rots[rightFootId].z,"XYZ");
    var new_torso_translate = new THREE.Vector3(torso_translate.x,torso_translate.y+1,torso_translate.z);
    var new_torso_pos = new THREE.Vector3(torso_pos.x,torso_pos.y+1,torso_pos.z);
    t_0 +=3
    new_keyframes.push([t_0, [new_rotations], new_torso_translate, new_torso_pos]);

    var new_rotations_1 = Array.from(Array(17), () => new THREE.Euler(0, 0, 0, 'XYZ'));
    for (var i = 0; i < 17; i++) new_rotations_1[i].copy(new_rotations[i]);
    new_rotations_1[torsoId] = new THREE.Euler(0, -0, 0, 'XYZ')
    new_rotations_1[leftUpperLegId].copy( rotations[leftUpperLegId]);
    new_rotations_1[rightUpperLegId].copy( rotations[rightUpperLegId]);
    new_rotations_1[leftLowerLegId].copy( rotations[leftLowerLegId]);
    new_rotations_1[rightLowerLegId].copy( rotations[rightLowerLegId]);
    new_rotations_1[leftFootId].copy( rotations[leftFootId]);
    new_rotations_1[rightFootId].copy( rotations[rightFootId]);
    new_rotations[rightLowerArmId] = new THREE.Euler(rots[rightLowerArmId].x - 130*Math.PI/180,rots[rightLowerArmId].y + 110*Math.PI/180 , rots[rightLowerArmId].z, "XYZ")
    new_rotations[rightUpperArmId] = new THREE.Euler(90*Math.PI/180,rots[rightUpperArmId].y -60*Math.PI/180 , rots[rightUpperArmId].z+45*Math.PI/180,  "XYZ")
    
    t_0 +=3
    new_keyframes.push([t_0, [new_rotations_1], torso_translate, torso_pos]);
    return new_keyframes;
}

function addAnimation() {

    //console.log(keyframes);
    var full_animation = [];
    var rise_arms = riseArms(rotations);
    full_animation.push(rise_arms);
    var pat_chest = patChest(rise_arms[1][0]);
    full_animation.push(pat_chest);
    var coconut_shaking = coconutShaking(pat_chest[1][0]);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    var low_arms = lowArms(pat_chest[1][0]);
    full_animation.push(low_arms);
    var rise_arms_2 = riseArms(rotations);
    full_animation.push(rise_arms_2);
    //console.log(pat_chest[1][0]==low_arms[1][0]);
    var shake_arms = shakeArms(rise_arms_2[1][0]);
    full_animation = full_animation.concat(shake_arms);
    full_animation = full_animation.concat(shakeArms(rise_arms_2[1][0]));
    full_animation = full_animation.concat(shakeArms(rise_arms_2[1][0]));
    full_animation.push(patChest(rise_arms_2[1][0]));
    var coconut_shaking = coconutShaking(full_animation[full_animation.length-1][1][0]);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation.push(lowArms(full_animation[full_animation.length-1][1][0]));
    full_animation.push(crossArms(full_animation[full_animation.length-1][1][0]));
    var coconut_shaking = coconutShaking(full_animation[full_animation.length-1][1][0]);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    var pat_right_elbow = patRightElbow(full_animation[full_animation.length-1][1][0]);
    full_animation.push(pat_right_elbow);
    var coconut_shaking = coconutShaking(full_animation[full_animation.length-1][1][0]);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation = full_animation.concat(coconut_shaking);
    full_animation.push(crossArms(low_arms[1][0]));

    var hello_an = hello(full_animation[full_animation.length-1][1][0]);
    full_animation.push(hello_an);
    var jump_an = jump(full_animation[full_animation.length-1][1][0]);
    full_animation = full_animation.concat(jump_an);
    var coconut_shaking_vertical = coconutShakingVertical(full_animation[full_animation.length-1][1][0]);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    full_animation = full_animation.concat(coconut_shaking_vertical);
    return full_animation
    
}

function animationStep() {
    var k;
    for (k = 0; t >= keyframes[k][0]; k++) {
        //console.log(t, keyframes[k][0])
    }

    console.log(t, k)
    //console.log(keyframes);

    var t0 = keyframes[k - 1][0];
    var theta0 = keyframes[k - 1][1][0];
    var position0 = keyframes[k - 1][2];
    var position_torso0 = keyframes[k - 1][3];

    
    var t1 = keyframes[k][0];
    var theta1 = keyframes[k][1][0];
    var position1 = keyframes[k][2];
    var position_torso1 = keyframes[k][3];
    //console.log(theta0 == theta1);
    //console.log( keyframes[k][2].x);

    for (var i = 0; i < 17; i++) {
        if (theta0[i] != theta1[i]) {
            var rot_x = theta0[i].x + (t - t0) / (t1 - t0) * (theta1[i].x - theta0[i].x);
            var rot_y = theta0[i].y + (t - t0) / (t1 - t0) * (theta1[i].y - theta0[i].y);
            var rot_z = theta0[i].z + (t - t0) / (t1 - t0) * (theta1[i].z - theta0[i].z);
            rotations[i] = new THREE.Euler(rot_x, rot_y, rot_z, 'XYZ');
            if (i==torsoId){
                //console.log(keyframes[k][1]);
            }
            //console.log(rotations[i]);

        }

    }
    //for (var i = 0; i < torso_translate.length; i++) torso_translate[i] = position0[i] + (t - t0) / (t1 - t0) * (position1[i] - position0[i]);
    var trans_x = position0.x + (t - t0) / (t1 - t0) * (position1.x - position0.x);
    var trans_y = position0.y + (t - t0) / (t1 - t0) * (position1.y - position0.y);
    var trans_z = position0.z + (t - t0) / (t1 - t0) * (position1.z - position0.z);
    torso_translate = new THREE.Vector3(trans_x,trans_y,trans_z);
    var trans_x = position_torso0.x + (t - t0) / (t1 - t0) * (position_torso1.x - position_torso0.x);
    var trans_y = position_torso0.y + (t - t0) / (t1 - t0) * (position_torso1.y - position_torso0.y);
    var trans_z = position_torso0.z + (t - t0) / (t1 - t0) * (position_torso1.z - position_torso0.z);
    torso_pos = new THREE.Vector3(trans_x,trans_y,trans_z);
    //console.log(rotations);
    // if (k == keyframes.length) {
    //     console.log(k, keyframes.length)
    //     t = 0;
    // }
}

function updateStep() {
    //console.log(keyframes);

    t += 1;
    var T = keyframes[keyframes.length - 1][0];
    console.log(T);
    if (t >= T) {
        t = 0;
        if (transition) {
            T = keyframes[keyframes.length - 1][0];
            //transition = !transition;
        }
        
    }

    if (transition) {
        animationStep();
    }

}

function traverse(Id) {

    if (Id == null) return;

    figure[Id].render();
    if (figure[Id].child1 != null) traverse(figure[Id].child1);
    //console.log(figure[Id].child1);
    if (figure[Id].child2 != null) traverse(figure[Id].child2);
    if (figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function torso() {

    var bone = skeleton.bones[torsoId];

    //console.log(rotations[torsoId])
    bone.position.copy(torso_translate);
    bone.setRotationFromEuler(rotations[torsoId]);
    model.getObjectByName('Kakamora').position.copy(torso_pos);
    model.getObjectByName('Kakamora').setRotationFromEuler(rotations[torsoId]);
    //console.log(bone.name + ': '+ bone.position.x + ','+ bone.position.y + ','+ bone.position.z);
    //

}

function leftShoulder() {

    var bone = skeleton.bones[leftShoulderId];

    bone.setRotationFromEuler(rotations[leftShoulderId]);

}
function leftUpperArm() {

    var bone = skeleton.bones[leftUpperArmId];

    bone.setRotationFromEuler(rotations[leftUpperArmId]);

}

function leftLowerArm() {

    var bone = skeleton.bones[leftLowerArmId];

    bone.setRotationFromEuler(rotations[leftLowerArmId]);

}

function rightShoulder() {

    var bone = skeleton.bones[rightShoulderId];

    bone.setRotationFromEuler(rotations[rightShoulderId]);

}
function rightUpperArm() {

    var bone = skeleton.bones[rightUpperArmId];

    bone.setRotationFromEuler(rotations[rightUpperArmId]);

}

function rightLowerArm() {

    var bone = skeleton.bones[rightLowerArmId];

    bone.setRotationFromEuler(rotations[rightLowerArmId]);

}

function leftHip() {

    var bone = skeleton.bones[leftHipId];

    bone.setRotationFromEuler(rotations[leftHipId]);

}
function leftUpperLeg() {

    var bone = skeleton.bones[leftUpperLegId];

    bone.setRotationFromEuler(rotations[leftUpperLegId]);

}

function leftLowerLeg() {

    var bone = skeleton.bones[leftLowerLegId];

    bone.setRotationFromEuler(rotations[leftLowerLegId]);

}

function rightHip() {

    var bone = skeleton.bones[rightHipId];

    bone.setRotationFromEuler(rotations[rightHipId]);

}
function rightUpperLeg() {

    var bone = skeleton.bones[rightUpperLegId];

    bone.setRotationFromEuler(rotations[rightUpperLegId]);

}

function rightLowerLeg() {

    var bone = skeleton.bones[rightLowerLegId];

    bone.setRotationFromEuler(rotations[rightLowerLegId]);

}

function leftHand() {

    var bone = skeleton.bones[leftHandId];

    bone.setRotationFromEuler(rotations[leftHandId]);

}
function rightHand() {

    var bone = skeleton.bones[rightHandId];

    bone.setRotationFromEuler(rotations[rightHandId]);

}
function leftFoot() {

    var bone = skeleton.bones[leftFootId];

    bone.setRotationFromEuler(rotations[leftFootId]);

}
function rightFoot() {

    var bone = skeleton.bones[rightFootId];

    bone.setRotationFromEuler(rotations[rightFootId]);

}



function initNodes(Id) {

    //var m = new THREE.Matrix4();


    switch (Id) {


        case torsoId:

            figure[torsoId] = createNode(torso, null, leftShoulderId, leftHipId);
            break;


        case leftShoulderId:

            figure[leftShoulderId] = createNode(leftShoulder, rightShoulderId, leftUpperArmId, null);
            break;
        case rightShoulderId:

            figure[rightShoulderId] = createNode(rightShoulder, null, rightUpperArmId, null);
            break;

        case leftUpperArmId:

            figure[leftUpperArmId] = createNode(leftUpperArm, null, leftLowerArmId, null);
            break;

        case rightUpperArmId:

            figure[rightUpperArmId] = createNode(rightUpperArm, null, rightLowerArmId, null);
            break;

        case leftHipId:

            figure[leftHipId] = createNode(leftHip, rightHipId, leftUpperLegId, null);
            break;
        case rightHipId:

            figure[rightHipId] = createNode(rightHip, null, rightUpperLegId, null);
            break;
        case leftUpperLegId:

            figure[leftUpperLegId] = createNode(leftUpperLeg, null, leftLowerLegId, null);
            break;

        case rightUpperLegId:

            figure[rightUpperLegId] = createNode(rightUpperLeg, null, rightLowerLegId, null);
            break;

        case leftLowerArmId:

            figure[leftLowerArmId] = createNode(leftLowerArm, null, leftHandId, null);
            break;

        case rightLowerArmId:

            figure[rightLowerArmId] = createNode(rightLowerArm, null, rightHandId, null);
            break;

        case leftLowerLegId:

            figure[leftLowerLegId] = createNode(leftLowerLeg, null, leftFootId, null);
            break;

        case rightLowerLegId:

            figure[rightLowerLegId] = createNode(rightLowerLeg, null, rightFootId, null);
            break;
        case leftHandId:

            figure[leftHandId] = createNode(leftHand, null, null, null);
            break;

        case rightHandId:

            figure[rightHandId] = createNode(rightHand, null, null, null);
            break;
        case leftFootId:

            figure[leftFootId] = createNode(leftFoot, null, null, null);
            break;

        case rightFootId:

            figure[rightFootId] = createNode(rightFoot, null, null, null);
            break;






    }

}



var initialize = function () {
    
    loader = new GLTFLoader();
    scene = new THREE.Scene();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( 'https://www.gstatic.com/draco/v1/decoders/' );
    loader.setDRACOLoader( dracoLoader );

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    
    spotLight_1 = new THREE.SpotLight( 0x33FFC7 );
    spotLight_1.position.set( 10, 10, 0 );
    spotLight_2 = new THREE.SpotLight( 0xFFBB33 );
    spotLight_2.position.set( 0, 10, 10 );
    spotLight_3 = new THREE.SpotLight( 0xA233FF );
    spotLight_2.position.set( 10, 0, -10 );
    spotLight_1.lookAt(scene.position);
    spotLight_2.lookAt(scene.position);
    spotLight_3.lookAt(scene.position);
    spotLight_3.castShadow = true;
    spotLight_2.castShadow = true;
    spotLight_1.castShadow = true;
    scene.add(spotLight_1);
    scene.add(spotLight_2);
    //scene.add(spotLight_3);
    const axesHelper = new THREE.AxesHelper( 5 );
    //scene.add( axesHelper );
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    //renderer.shadowMapSoft = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    return new Promise((resolve, reject) => loader.load('../Model/kakamora.glb',
        function (gltf) {
            scene.add(gltf.scene);
            model = gltf.scene;

            model.traverse(function (object) {

                if (object.isMesh && (object.name != "Plane")){
                    object.castShadow = true;                  
                    
                } 
                if (object.name == "Plane"){
                    object.receiveShadow = true;
                    object.castShadow = true;
                }
                

            });
            skeleton = new THREE.SkeletonHelper(model);
            skeleton.visible = false;
            //console.log(skeleton.bones);
            scene.add(skeleton);
            scene.add(camera);
            camera.position.set(4, 1.5, 0);
            camera.lookAt(scene.position);
            
            
            for (var i = 0; i < 17; i++) initNodes(i);
            //console.log(skeleton);
            torso_translate.copy(skeleton.bones[torsoId].position);
            torso_pos.copy(scene.getObjectByName('Kakamora').position);
            
            rotations[torsoId].copy(skeleton.bones[torsoId].rotation);
            //console.log(rotations[torsoId])
            skeleton.bones[torsoId].traverse(function (child) {
                
                if (child.isBone) {
                    var euler_idx = skeleton.bones.indexOf(child);
                    rotations[euler_idx] = child.rotation;
                    //child.setRotationFromEuler(rotations[euler_idx]);
                }
            })
            //console.log(scene.objects);
            controls = new OrbitControls( camera, renderer.domElement );
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;

            controls.screenSpacePanning = false;

            controls.minDistance = 5;
            controls.maxDistance = 20;

            controls.maxPolarAngle = Math.PI / 2;
            controls.update();
            //const image_loader = new THREE.TextureLoader();
            //image_loader.load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg' , function(texture)
            //{
            // scene.background = texture;  
            //});
            
            render();
            resolve(gltf);

        },
        function(xhr){
            console.log((xhr.loaded/xhr.total*100)+"% loaded");
        },
        function (error) {

            console.log(error);
            reject(error);



        }))



    

}



window.onload = function init() {
    

    canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext('webgl2');
    if (!gl) { alert("WebGL 2.0 isn't available"); }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    keyframes = [[t_0, [rotations], torso_translate, torso_pos]];
    initialize().then((result) => {       
        
        console.log(result.scene);
        console.log(camera);
        
        keyframes = keyframes.concat(addAnimation());
        console.log(keyframes);
    }
    );

    document.body.onkeyup = function(e){
        if (e.key !== 'Space'){
            transition = !transition;
        }
    }
    for (i = 0; i < 17; i++) initNodes(i);
    //render();
    


}

var render = function () {


    gl.clear(gl.COLOR_BUFFER_BIT);


    if (transition) {
        //animate();
        //move(slider_x.value, slider_y.value, slider_z.value );
        //console.log("start");
        updateStep();
        for (i = 0; i < 17; i++) initNodes(i);


    }
    traverse(torsoId);

    //for (e of tween) THREE.update();
    
    requestAnimationFrame(render);
     
    renderer.render(scene, camera);



}