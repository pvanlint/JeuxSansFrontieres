#include <node.h>

using namespace v8;

#include <string>
#include <map>
#include <cstdlib>
#include <ctime>

using namespace std;
typedef map<string, double> RateMap;

RateMap fxrates;


void getRate(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = Isolate::GetCurrent();
    HandleScope scope(isolate);

    if (args.Length() > 0)
    {
        v8::String::Utf8Value param(args[0]->ToString());
        //string ccypair("GBPUSD");
        string ccypair(*param);
        //string ccypair = val.ToString();
        RateMap::iterator it = fxrates.find(ccypair);
        if (it != fxrates.end())
        {
            double rate = ((rand()%2)?
                                it->second + 0.000001:
                                it->second - 0.000001);
            it->second = rate;
            Local<Number> num = Number::New(isolate, rate);
            args.GetReturnValue().Set(num);
        }
        else
        {
            isolate->ThrowException(
                Exception::TypeError(
                    String::NewFromUtf8(isolate, "Currency pair not found")));
        }
    }
    else
    {
        isolate->ThrowException(
            Exception::TypeError(
                String::NewFromUtf8(isolate, "Wrong number of arguments")));
    }
    return;
}

void Init(Handle<Object> exports) {
    srand(time(0));
    fxrates.insert(RateMap::value_type("AUDUSD", 0.87968));
    fxrates.insert(RateMap::value_type("USDCAD", 1.123165));
    fxrates.insert(RateMap::value_type("USDCNY", 6.117300));
    fxrates.insert(RateMap::value_type("EURUSD", 1.266977));
    fxrates.insert(RateMap::value_type("GBPUSD", 1.608798));
    fxrates.insert(RateMap::value_type("USDINR", 61.279999));
    fxrates.insert(RateMap::value_type("USDJPY", 108.127499));
    NODE_SET_METHOD(exports, "getRate", getRate);
}

NODE_MODULE(addon, Init)

