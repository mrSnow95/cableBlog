---
title: Computational Geometry in C++
date: 2021-02-01
use_math: true
---


In this post i just want to make a compilation of useful C++ computational geometry algorithms used in Competitive Programming. One note is that it is defined $$\epsilon = 10^{-9} $$ in order to define at which precision two points are the same. But it may cause bugs depending on the level of precision of the problem. For example, the following code giver an error:


```c++
#define EPS 1e-9

struct point{
    double x,y;
    point(){x = y = 0.0;}
    point(double _x,double _y){x = _x;y = _y;}

    bool operator < (const point& other) const {
        if(fabs(x - other.x) > EPS){
            return x < other.x;
        }
        return y < other.y;
    }
    bool operator == (const point& other) const {
        return fabs(x - other.x) < EPS && fabs(y - other.y) < EPS;
    }
};
// error in precision
int main(){
    vector<point> p;
    p.emplace_back(2e-9,0);
    p.push_back({0,2});
    p.push_back({1e-9,1});
    sort(begin(p),end(p));
    for(auto &pt:p) printf("%.9lf , %.9lf\n",pt.x,pt.y);
}
```

The code depends specially of Analytic Geometry, Cross Products, Dot products and some classic Euclidean Geometry theorems:


****


```c++
#include <iostream>
#include <vector>
#include <string>
#include <vector>
#include <math.h>

#define EPS 1e-9
using namespace std;
typedef long double ld;


///////////////// POINT /////////////////////

struct point_i{
    int x,y;
    point_i(){x = y = 0;}
    point_i(int _x,int _y){x = _x;y = _y;}
};

struct point{
    double x,y;
    point(){x = y = 0.0;}
    point(double _x,double _y){x = _x;y = _y;}

    bool operator < (const point& other) const {
        if(fabs(x - other.x) > EPS){
            return x < other.x;
        }
        return y < other.y;
    }
    bool operator == (const point& other) const {
        return fabs(x - other.x) < EPS && fabs(y - other.y) < EPS;
    }
};
double hypot(double dx,double dy){return dx*dx + dy*dy;}
double dist(const point& p1,const point& p2){return hypot(p1.x - p2.x,p1.y - p2.y);}

double DEG_to_RAD(double d){return d*M_PI / 180.0;}
double RAD_to_DEG(double r){return r*180.0 / M_PI;}

point rotate(const point& p,double theta_deg){
    double rad = DEG_to_RAD(theta_deg);
    return point(p.x*cos(rad) - p.y*sin(rad), p.x*sin(rad) + p.y*cos(rad));
}



////////////////// LINE //////////////////////


struct line {double a,b,c;};
void pointsToLine(const point&p1,const point&p2,line& l){
    if(fabs(p1.x - p2.x) < EPS) l = {1.0,0.0,-p1.x};
    else l = {-(double)(p1.y - p2.y) / (double)(p1.x - p2.x), 1 , -(double)l.a*p1.x - p1.y};
}

void pointSlopeToLine(point p,double m,line& l){
    l = {
        -m,
        1.0,
        -( (l.a*p.x) + p.y )
    };
}

bool areParallel(line l1,line l2){ return fabs(l1.a - l2.a) < EPS && fabs(l1.b - l2.b) < EPS;}
bool areSame(line l1,line l2){return areParallel(l1,l2) && fabs(l1.c - l2.c) < EPS;}

bool areIntersect(line l1,line l2,point& p){
    if(areParallel(l1,l2)) return false;
    p.x = (l2.b*l1.c - l1.b*l2.c) / (l2.a*l1.b - l1.a*l2.b);
    if(fabs(l1.b) > EPS) p.y = -(l1.a*p.x + l1.c);
    else p.y = -(l2.a*p.x + l2.c);
    return true;
}


///////////////// VECTOR ///////////////////


struct vec{
    double x,y;
    vec(double _x,double _y){x = _x;y = _y;}
};

vec toVec(const point& a,const point& b){ return vec(b.x - a.x,b.y - a.y);}

vec scale(const vec& v,double s){return vec(s*v.x,s*v.y);}

double norm(const vec& v){return sqrt(hypot(v.x,v.y));}
double norm_sq(const vec& v){return pow(norm(v),2);}


point translate(const point&p,const vec& v){return point(p.x + v.x, p.y + v.y);}



double dot(const vec& a,const vec& b){return a.x*b.x + a.y*b.y;}

double angle(const point&a,const point& o,const point& b){
    vec ao = toVec(a,o);
    vec bo = toVec(b,o);
    return acos(dot(ao,bo) / norm_sq(ao));
}

double distToLine(const point& p,const point& a,const point& b,point& c){
    vec ap = toVec(a,p);
    vec ab = toVec(a,b);
    double u = dot(ap,ab) / norm_sq(ab);
    c = translate(a,scale(ab,u));
    return dist(p,c);
}
double distToLineSegment(point p,point a,point b,point& c){
    vec ap = toVec(a,p) , ab = toVec(a,b);
    double u = dot(ap,ab) / norm_sq(ab);
    if( u < 0.0){
        c = point(a.x,a.y);
        return dist(a,p);
    }
    if(u > 1.0){
        c = point(b.x,b.y);
        return dist(b,p);
    }
    return distToLine(p,a,b,c);
}


double cross(vec a,vec b){ return a.x*b.y - a.y*b.x; }
bool ccw(point p,point q,point r){ //returns true if point r is on the left of line pq
    return cross(toVec(p,r),toVec(p,q))  > EPS;
}

// 0 if inside , 1 if on border , - 1 if outside
int insideCircle(const point_i& p,const point_i& c,int r){
    int dx = p.x - c.x; int dy = p.y - c.y;
    int Euc = dx*dx + dy*dy, rSq = r*r;
    return Euc < rSq ? 1 : (Euc == rSq ? 0 : -1);
}


//////////// CIRCLE //////////////

int insideCircle(point_i p, point_i c, int r) {  // all integer version
  int dx = p.x-c.x, dy = p.y-c.y;
  int Euc = dx*dx + dy*dy, rSq = r*r;            // all integer
  return Euc < rSq ? 1 : Euc == rSq ? 0 : -1;    // inside/border/outside
}

bool circle2PtsRad(point p1, point p2, double r, point &c) {
  // to get the other center, reverse p1 and p2
  double d2 = (p1.x-p2.x) * (p1.x-p2.x) + 
              (p1.y-p2.y) * (p1.y-p2.y);
  double det = r*r / d2 - 0.25;
  if (det < 0.0) return false;
  double h = sqrt(det);
  c.x = (p1.x+p2.x) * 0.5 + (p1.y-p2.y) * h;
  c.y = (p1.y+p2.y) * 0.5 + (p2.x-p1.x) * h;
  return true;
}


// returns true if point d is inside the circumCircle defined by a,b,c
int inCircumCircle(point a, point b, point c, point d) {
  return (a.x - d.x) * (b.y - d.y) * ((c.x - d.x) * (c.x - d.x) + (c.y - d.y) * (c.y - d.y)) +
         (a.y - d.y) * ((b.x - d.x) * (b.x - d.x) + (b.y - d.y) * (b.y - d.y)) * (c.x - d.x) +
         ((a.x - d.x) * (a.x - d.x) + (a.y - d.y) * (a.y - d.y)) * (b.x - d.x) * (c.y - d.y) -
         ((a.x - d.x) * (a.x - d.x) + (a.y - d.y) * (a.y - d.y)) * (b.y - d.y) * (c.x - d.x) -
         (a.y - d.y) * (b.x - d.x) * ((c.x - d.x) * (c.x - d.x) + (c.y - d.y) * (c.y - d.y)) -
         (a.x - d.x) * ((b.x - d.x) * (b.x - d.x) + (b.y - d.y) * (b.y - d.y)) * (c.y - d.y) > 0 ? 1 : 0;
}

//////// TRIANGLE ///////////////

double perimeter(double ab, double bc, double ca) {
  return ab + bc + ca;
}

double perimeter(point a, point b, point c) {
  return dist(a, b) + dist(b, c) + dist(c, a);
}

double area(double ab, double bc, double ca) {
  // Heron's formula, split sqrt(a*b) into sqrt(a)*sqrt(b)
  double s = 0.5 * perimeter(ab, bc, ca);
  return sqrt(s) * sqrt(s-ab) * sqrt(s-bc) * sqrt(s-ca);
}

double area(point a, point b, point c) {
  return area(dist(a, b), dist(b, c), dist(c, a));
}

bool canFormTriangle(double a, double b, double c) {
  return (a+b > c) && (a+c > b) && (b+c > a);
}

////////// POLYGONS ///////////

// returns true if we always make the same turn
// while examining all the edges of the polygon one by one
bool isConvex(const vector<point> &P) {
  int n = (int)P.size();
  // a point/sz=2 or a line/sz=3 is not convex  
  if (n <= 3) return false;
  bool firstTurn = ccw(P[0], P[1], P[2]);        // remember one result,
  for (int i = 1; i < n-1; ++i)                 // compare with the others
    if (ccw(P[i], P[i+1], P[(i+2) == n ? 1 : i+2]) != firstTurn)
      return false;                              // different -> concave
  return true;                                   // otherwise -> convex
}

// returns 1/0/-1 if point p is inside/on (vertex/edge)/outside of
// either convex/concave polygon P
int insidePolygon(point pt, const vector<point> &P) {
  int n = (int)P.size();
  if (n <= 3) return -1;                         // avoid point or line
  bool on_polygon = false;
  for (int i = 0; i < n-1; ++i)                  // on vertex/edge?
    if (fabs(dist(P[i], pt) + dist(pt, P[i+1]) - dist(P[i], P[i+1])) < EPS)
      on_polygon = true;
  if (on_polygon) return 0;                      // pt is on polygon
  double sum = 0.0;                              // first = last point
  for (int i = 0; i < n-1; ++i) {
    if (ccw(pt, P[i], P[i+1]))
      sum += angle(P[i], pt, P[i+1]);            // left turn/ccw
    else
      sum -= angle(P[i], pt, P[i+1]);            // right turn/cw
  }
  return fabs(sum) > M_PI ? 1 : -1;              // 360d->in, 0d->out
}

// cuts polygon Q along the line formed by point A->point B (order matters)
// (note: the last point must be the same as the first point)
vector<point> cutPolygon(point A, point B, const vector<point> &Q) {
  vector<point> P;
  for (int i = 0; i < (int)Q.size(); ++i) {
    double left1 = cross(toVec(A, B), toVec(A, Q[i])), left2 = 0;
    if (i != (int)Q.size()-1) left2 = cross(toVec(A, B), toVec(A, Q[i+1]));
    if (left1 > -EPS) P.push_back(Q[i]);         // Q[i] is on the left
    if (left1*left2 < -EPS)                      // crosses line AB
      P.push_back(lineIntersectSeg(Q[i], Q[i+1], A, B));
  }
  if (!P.empty() && !(P.back() == P.front()))
    P.push_back(P.front());                      // wrap around
  return P;
}

vector<point> CH_Graham(vector<point> &Pts) {    // overall O(n log n)
  vector<point> P(Pts);                          // copy all points
  int n = (int)P.size();
  if (n <= 3) {                                  // point/line/triangle
    if (!(P[0] == P[n-1])) P.push_back(P[0]);    // corner case
    return P;                                    // the CH is P itself
  }

  // first, find P0 = point with lowest Y and if tie: rightmost X
  int P0 = min_element(P.begin(), P.end())-P.begin();
  swap(P[0], P[P0]);                             // swap P[P0] with P[0]

  // second, sort points by angle around P0, O(n log n) for this sort
  sort(++P.begin(), P.end(), [&](point a, point b) {
    return ccw(P[0], a, b);                      // use P[0] as the pivot
  });

  // third, the ccw tests, although complex, it is just O(n)
  vector<point> S({P[n-1], P[0], P[1]});         // initial S
  int i = 2;                                     // then, we check the rest
  while (i < n) {                                // n > 3, O(n)
    int j = (int)S.size()-1;
    if (ccw(S[j-1], S[j], P[i]))                 // CCW turn
      S.push_back(P[i++]);                       // accept this point
    else                                         // CW turn
      S.pop_back();                              // pop until a CCW turn
  }
  return S;                                      // return the result
}

vector<point> CH_Andrew(vector<point> &Pts) {    // overall O(n log n)
  int n = Pts.size(), k = 0;
  vector<point> H(2*n);
  sort(Pts.begin(), Pts.end());                  // sort the points by x/y
  for (int i = 0; i < n; ++i) {                  // build lower hull
    while ((k >= 2) && !ccw(H[k-2], H[k-1], Pts[i])) --k;
    H[k++] = Pts[i];
  }
  for (int i = n-2, t = k+1; i >= 0; --i) {       // build upper hull
    while ((k >= t) && !ccw(H[k-2], H[k-1], Pts[i])) --k;
    H[k++] = Pts[i];
  }
  H.resize(k);
  return H;
}

```

