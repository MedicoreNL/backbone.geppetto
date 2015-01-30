"use strict";

/* global describe, it, beforeEach */
/* jshint unused:false */

var _ = require( "underscore" );
var sinon = require( "sinon" );

var expect = require( "must" );

var Geppetto = require( "../backbone.geppetto.js" );

var FixtureClass = function(){
    this.foo = undefined;
    this.params = _.toArray( arguments );
};

describe( "-- producer provider -- ", function(){
    describe( "spec file", function(){
        it( "should be found", function(){
            expect( true ).to.be.true();
        } );
    } );
    var context;
    var undefined;
    beforeEach( function(){
        context = new Geppetto.Context();
    } );
    afterEach( function(){
        context.release.all();
        context = undefined;
    } );
    describe( "wiring an object as producer", function(){
        it( "should throw an error", function(){
            expect( function(){
                context.wire( {} )
                    .as.producer( "not a valid producer" )
            } ).to.throw( /function/ );
        } );
    } );
    describe( "wiring a string as producer", function(){
        it( "should throw an error", function(){
            expect( function(){
                context.wire( "this is not a function" )
                    .as.producer( "not a valid producer" )
            } ).to.throw( /function/ );
        } );
    } );
    describe( "wiring an array as producer", function(){
        it( "should throw an error", function(){
            expect( function(){
                context.wire( [] )
                    .as.producer( "not a valid producer" )
            } ).to.throw( /function/ );
        } );
    } );
    describe( "wiring a number as producer", function(){
        it( "should throw an error", function(){
            expect( function(){
                context.wire( 9 )
                    .as.producer( "not a valid producer" )
            } ).to.throw( /function/ );
        } );
    } );
    describe( "wiring a boolean as producer", function(){
        it( "should throw an error", function(){
            expect( function(){
                context.wire( true )
                    .as.producer( "not a valid producer" )
            } ).to.throw( /function/ );
        } );
    } );
    
    describe( "when wiring a function", function(){
        var mapper;
        beforeEach( function(){
            mapper = context.wire( FixtureClass )
                .as.producer( "producer" );
        } );
        it( "should resolve to an instance of the class", function(){
            var instance = context.get( "producer" );
            expect( instance ).to.be.an.instanceOf( FixtureClass );
        } );
        it( "should never resolve to the same object", function(){
            var o1 = context.get( "producer" );
            var o2 = context.get( "producer" );
            expect( o1 ).to.not.equal( o2 );
        } );
        it( "should resolve its dependencies", function(){
            FixtureClass.prototype.wiring = "dep";
            var dep = {};
            context.wire( dep ).as.value( "dep" );
            var result = context.get( "producer" );
            expect( result.dep ).to.equal( dep );
            delete FixtureClass.prototype.wiring;
        } );
        it( "should pass the parameters to the constructor", function(){
            var a = {}, b = "b", c = [ "c" ];
            mapper.using.parameters( a, b, c );
            var result = context.get( "producer" );
            expect( result.params[ 0 ] ).to.equal( a );
            expect( result.params[ 1 ] ).to.equal( b );
            expect( result.params[ 2 ] ).to.equal( c );
        } );
    } );
} );