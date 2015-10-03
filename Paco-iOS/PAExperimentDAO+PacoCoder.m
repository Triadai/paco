//
//  PAExperimentDAO+PacoCoder.m
//  Paco
//
//  Created by northropo on 9/30/15.
//  Copyright (c) 2015 Paco. All rights reserved.
//

#import "PAExperimentDAO+PacoCoder.h"

#import "PacoSerializer.h"
#import "java/util/ArrayList.h"
#import  "PacoSerializeUtil.h"
#import "ExperimentDAO.h"

#define JsonKey @"kjsonPrsistanceKey"

@implementation PAExperimentDAO (PacoCoder)

- (id)initWithCoder:(NSCoder *)decoder
{
    /* super does not support  initWithCoder so we don't try to invoke it */
    
        NSData* data = [decoder decodeObjectForKey:JsonKey];
        PacoSerializer* serializer =
        [[PacoSerializer alloc] initWithArrayOfClasses:nil
                              withNameOfClassAttribute:@"nameOfClass"];
        JavaUtilArrayList  *  resultArray  = (JavaUtilArrayList*) [serializer buildObjectHierarchyFromJSONOBject:data];
        IOSObjectArray * iosArray = [resultArray toArray];
        PAExperimentDAO * experiment  =  [iosArray objectAtIndex:0];
        self =experiment;
    
    return self;
 
    
    
}


- (void) encodeWithCoder:(NSCoder *)encoder
{
    
    NSArray* array = [PacoSerializeUtil getClassNames];
    PacoSerializer * serializer = [[PacoSerializer alloc] initWithArrayOfClasses:array withNameOfClassAttribute:@"nameOfClass"];
    NSData* json = [serializer toJSONobject:self];
    [encoder encodeObject:json  forKey:JsonKey];
}


- (id)copyWithZone:(NSZone *)zone {
    
    NSArray* array = [PacoSerializeUtil getClassNames];
    PacoSerializer * serializer = [[PacoSerializer alloc] initWithArrayOfClasses:array withNameOfClassAttribute:@"nameOfClass"];
    NSData* json = [serializer toJSONobject:self];
    
    JavaUtilArrayList  *  resultArray  = (JavaUtilArrayList*) [serializer buildObjectHierarchyFromJSONOBject:json];
    IOSObjectArray * iosArray = [resultArray toArray];
    PAExperimentDAO  * experimentCopy =  [iosArray objectAtIndex:0];
    return experimentCopy;
    
}
@end
