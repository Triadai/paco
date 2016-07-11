//
//  Generated by the J2ObjC translator.  DO NOT EDIT!
//  source: joda-time/src/main/java/org/joda/time/chrono/BasicDayOfYearDateTimeField.java
//

#include "IOSPrimitiveArray.h"
#include "J2ObjC_source.h"
#include "org/joda/time/DateTimeField.h"
#include "org/joda/time/DateTimeFieldType.h"
#include "org/joda/time/DurationField.h"
#include "org/joda/time/ReadablePartial.h"
#include "org/joda/time/chrono/BasicChronology.h"
#include "org/joda/time/chrono/BasicDayOfYearDateTimeField.h"
#include "org/joda/time/field/PreciseDurationDateTimeField.h"

@interface OrgJodaTimeChronoBasicDayOfYearDateTimeField () {
 @public
  OrgJodaTimeChronoBasicChronology *iChronology_;
}

- (id)readResolve;

@end

J2OBJC_FIELD_SETTER(OrgJodaTimeChronoBasicDayOfYearDateTimeField, iChronology_, OrgJodaTimeChronoBasicChronology *)

inline jlong OrgJodaTimeChronoBasicDayOfYearDateTimeField_get_serialVersionUID();
#define OrgJodaTimeChronoBasicDayOfYearDateTimeField_serialVersionUID -6821236822336841037LL
J2OBJC_STATIC_FIELD_CONSTANT(OrgJodaTimeChronoBasicDayOfYearDateTimeField, serialVersionUID, jlong)

@implementation OrgJodaTimeChronoBasicDayOfYearDateTimeField

- (instancetype)initWithOrgJodaTimeChronoBasicChronology:(OrgJodaTimeChronoBasicChronology *)chronology
                            withOrgJodaTimeDurationField:(OrgJodaTimeDurationField *)days {
  OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(self, chronology, days);
  return self;
}

- (jint)getWithLong:(jlong)instant {
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDayOfYearWithLong:instant];
}

- (OrgJodaTimeDurationField *)getRangeDurationField {
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) years];
}

- (jint)getMinimumValue {
  return 1;
}

- (jint)getMaximumValue {
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearMax];
}

- (jint)getMaximumValueWithLong:(jlong)instant {
  jint year = [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getYearWithLong:instant];
  return [iChronology_ getDaysInYearWithInt:year];
}

- (jint)getMaximumValueWithOrgJodaTimeReadablePartial:(id<OrgJodaTimeReadablePartial>)partial {
  if ([((id<OrgJodaTimeReadablePartial>) nil_chk(partial)) isSupportedWithOrgJodaTimeDateTimeFieldType:OrgJodaTimeDateTimeFieldType_year()]) {
    jint year = [partial getWithOrgJodaTimeDateTimeFieldType:OrgJodaTimeDateTimeFieldType_year()];
    return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearWithInt:year];
  }
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearMax];
}

- (jint)getMaximumValueWithOrgJodaTimeReadablePartial:(id<OrgJodaTimeReadablePartial>)partial
                                         withIntArray:(IOSIntArray *)values {
  jint size = [((id<OrgJodaTimeReadablePartial>) nil_chk(partial)) size];
  for (jint i = 0; i < size; i++) {
    if ([partial getFieldTypeWithInt:i] == OrgJodaTimeDateTimeFieldType_year()) {
      jint year = IOSIntArray_Get(nil_chk(values), i);
      return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearWithInt:year];
    }
  }
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearMax];
}

- (jint)getMaximumValueForSetWithLong:(jlong)instant
                              withInt:(jint)value {
  jint maxLessOne = [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) getDaysInYearMax] - 1;
  return (value > maxLessOne || value < 1) ? [self getMaximumValueWithLong:instant] : maxLessOne;
}

- (jboolean)isLeapWithLong:(jlong)instant {
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) isLeapDayWithLong:instant];
}

- (id)readResolve {
  return [((OrgJodaTimeChronoBasicChronology *) nil_chk(iChronology_)) dayOfYear];
}

- (void)dealloc {
  RELEASE_(iChronology_);
  [super dealloc];
}

+ (const J2ObjcClassInfo *)__metadata {
  static const J2ObjcMethodInfo methods[] = {
    { "initWithOrgJodaTimeChronoBasicChronology:withOrgJodaTimeDurationField:", "BasicDayOfYearDateTimeField", NULL, 0x0, NULL, NULL },
    { "getWithLong:", "get", "I", 0x1, NULL, NULL },
    { "getRangeDurationField", NULL, "Lorg.joda.time.DurationField;", 0x1, NULL, NULL },
    { "getMinimumValue", NULL, "I", 0x1, NULL, NULL },
    { "getMaximumValue", NULL, "I", 0x1, NULL, NULL },
    { "getMaximumValueWithLong:", "getMaximumValue", "I", 0x1, NULL, NULL },
    { "getMaximumValueWithOrgJodaTimeReadablePartial:", "getMaximumValue", "I", 0x1, NULL, NULL },
    { "getMaximumValueWithOrgJodaTimeReadablePartial:withIntArray:", "getMaximumValue", "I", 0x1, NULL, NULL },
    { "getMaximumValueForSetWithLong:withInt:", "getMaximumValueForSet", "I", 0x4, NULL, NULL },
    { "isLeapWithLong:", "isLeap", "Z", 0x1, NULL, NULL },
    { "readResolve", NULL, "Ljava.lang.Object;", 0x2, NULL, NULL },
  };
  static const J2ObjcFieldInfo fields[] = {
    { "serialVersionUID", "serialVersionUID", 0x1a, "J", NULL, NULL, .constantValue.asLong = OrgJodaTimeChronoBasicDayOfYearDateTimeField_serialVersionUID },
    { "iChronology_", NULL, 0x12, "Lorg.joda.time.chrono.BasicChronology;", NULL, NULL, .constantValue.asLong = 0 },
  };
  static const J2ObjcClassInfo _OrgJodaTimeChronoBasicDayOfYearDateTimeField = { 2, "BasicDayOfYearDateTimeField", "org.joda.time.chrono", NULL, 0x10, 11, methods, 2, fields, 0, NULL, 0, NULL, NULL, NULL };
  return &_OrgJodaTimeChronoBasicDayOfYearDateTimeField;
}

@end

void OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(OrgJodaTimeChronoBasicDayOfYearDateTimeField *self, OrgJodaTimeChronoBasicChronology *chronology, OrgJodaTimeDurationField *days) {
  OrgJodaTimeFieldPreciseDurationDateTimeField_initWithOrgJodaTimeDateTimeFieldType_withOrgJodaTimeDurationField_(self, OrgJodaTimeDateTimeFieldType_dayOfYear(), days);
  JreStrongAssign(&self->iChronology_, chronology);
}

OrgJodaTimeChronoBasicDayOfYearDateTimeField *new_OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(OrgJodaTimeChronoBasicChronology *chronology, OrgJodaTimeDurationField *days) {
  OrgJodaTimeChronoBasicDayOfYearDateTimeField *self = [OrgJodaTimeChronoBasicDayOfYearDateTimeField alloc];
  OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(self, chronology, days);
  return self;
}

OrgJodaTimeChronoBasicDayOfYearDateTimeField *create_OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(OrgJodaTimeChronoBasicChronology *chronology, OrgJodaTimeDurationField *days) {
  OrgJodaTimeChronoBasicDayOfYearDateTimeField *self = [[OrgJodaTimeChronoBasicDayOfYearDateTimeField alloc] autorelease];
  OrgJodaTimeChronoBasicDayOfYearDateTimeField_initWithOrgJodaTimeChronoBasicChronology_withOrgJodaTimeDurationField_(self, chronology, days);
  return self;
}

J2OBJC_CLASS_TYPE_LITERAL_SOURCE(OrgJodaTimeChronoBasicDayOfYearDateTimeField)