#import "AndroidRawSensors.h"

@implementation AndroidRawSensors
- (NSNumber *)multiply:(double)a b:(double)b {
    NSNumber *result = @(a * b);

    return result;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeAndroidRawSensorsSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"AndroidRawSensors";
}

@end
