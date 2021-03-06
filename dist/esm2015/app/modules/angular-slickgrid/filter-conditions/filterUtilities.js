/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
export const testFilterCondition = (operator, value1, value2) => {
    switch (operator) {
        case '<':
        case 'LT': return (value1 < value2);
        case '<=':
        case 'LE': return (value1 <= value2);
        case '>':
        case 'GT': return (value1 > value2);
        case '>=':
        case 'GE': return (value1 >= value2);
        case '!=':
        case '<>':
        case 'NE': return (value1 !== value2);
        case '=':
        case '==':
        case 'EQ': return (value1 === value2);
        case 'IN': return ((value2 && value2.includes) ? (value2.includes(value1)) : false);
        case 'NIN':
        case 'NOT_IN':
            return ((value2 && value2.includes) ? (!value2.includes(value1)) : false);
        case 'IN_CONTAINS':
            if (value2 && Array.isArray(value2) && value2.findIndex) {
                return ((value2.findIndex((val) => value1.indexOf(val) > -1)) > -1);
            }
            return false;
        case 'NIN_CONTAINS':
        case 'NOT_IN_CONTAINS':
            if (value2 && Array.isArray(value2) && value2.findIndex) {
                return !((value2.findIndex((val) => value1.indexOf(val) > -1)) > -1);
            }
            return false;
    }
    return true;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyVXRpbGl0aWVzLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1zbGlja2dyaWQvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9hbmd1bGFyLXNsaWNrZ3JpZC9maWx0ZXItY29uZGl0aW9ucy9maWx0ZXJVdGlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxNQUFNLE9BQU8sbUJBQW1CLEdBQUcsQ0FBQyxRQUFnQixFQUFFLE1BQVcsRUFBRSxNQUFXLEVBQVcsRUFBRTtJQUN6RixRQUFRLFFBQVEsRUFBRTtRQUNoQixLQUFLLEdBQUcsQ0FBQztRQUNULEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNwQyxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztRQUNyQyxLQUFLLEdBQUcsQ0FBQztRQUNULEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNwQyxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsQ0FBQztRQUNyQyxLQUFLLElBQUksQ0FBQztRQUNWLEtBQUssSUFBSSxDQUFDO1FBQ1YsS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLEtBQUssR0FBRyxDQUFDO1FBQ1QsS0FBSyxJQUFJLENBQUM7UUFDVixLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDdEMsS0FBSyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEYsS0FBSyxLQUFLLENBQUM7UUFDWCxLQUFLLFFBQVE7WUFDWCxPQUFPLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1RSxLQUFLLGFBQWE7WUFDaEIsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUN2RCxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3JFO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDZixLQUFLLGNBQWMsQ0FBQztRQUNwQixLQUFLLGlCQUFpQjtZQUN0QixJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3ZELE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RTtZQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDWixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IHRlc3RGaWx0ZXJDb25kaXRpb24gPSAob3BlcmF0b3I6IHN0cmluZywgdmFsdWUxOiBhbnksIHZhbHVlMjogYW55KTogYm9vbGVhbiA9PiB7XHJcbiAgc3dpdGNoIChvcGVyYXRvcikge1xyXG4gICAgY2FzZSAnPCc6XHJcbiAgICBjYXNlICdMVCc6IHJldHVybiAodmFsdWUxIDwgdmFsdWUyKTtcclxuICAgIGNhc2UgJzw9JzpcclxuICAgIGNhc2UgJ0xFJzogcmV0dXJuICh2YWx1ZTEgPD0gdmFsdWUyKTtcclxuICAgIGNhc2UgJz4nOlxyXG4gICAgY2FzZSAnR1QnOiByZXR1cm4gKHZhbHVlMSA+IHZhbHVlMik7XHJcbiAgICBjYXNlICc+PSc6XHJcbiAgICBjYXNlICdHRSc6IHJldHVybiAodmFsdWUxID49IHZhbHVlMik7XHJcbiAgICBjYXNlICchPSc6XHJcbiAgICBjYXNlICc8Pic6XHJcbiAgICBjYXNlICdORSc6IHJldHVybiAodmFsdWUxICE9PSB2YWx1ZTIpO1xyXG4gICAgY2FzZSAnPSc6XHJcbiAgICBjYXNlICc9PSc6XHJcbiAgICBjYXNlICdFUSc6IHJldHVybiAodmFsdWUxID09PSB2YWx1ZTIpO1xyXG4gICAgY2FzZSAnSU4nOiByZXR1cm4gKCh2YWx1ZTIgJiYgdmFsdWUyLmluY2x1ZGVzKSA/ICh2YWx1ZTIuaW5jbHVkZXModmFsdWUxKSkgOiBmYWxzZSk7XHJcbiAgICBjYXNlICdOSU4nOlxyXG4gICAgY2FzZSAnTk9UX0lOJzpcclxuICAgICAgcmV0dXJuICgodmFsdWUyICYmIHZhbHVlMi5pbmNsdWRlcykgPyAoIXZhbHVlMi5pbmNsdWRlcyh2YWx1ZTEpKSA6IGZhbHNlKTtcclxuICAgIGNhc2UgJ0lOX0NPTlRBSU5TJzpcclxuICAgICAgaWYgKHZhbHVlMiAmJiBBcnJheS5pc0FycmF5KHZhbHVlMikgJiYgdmFsdWUyLmZpbmRJbmRleCkge1xyXG4gICAgICAgIHJldHVybiAoKHZhbHVlMi5maW5kSW5kZXgoKHZhbCkgPT4gdmFsdWUxLmluZGV4T2YodmFsKSA+IC0xKSkgPiAtMSk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgY2FzZSAnTklOX0NPTlRBSU5TJzpcclxuICAgIGNhc2UgJ05PVF9JTl9DT05UQUlOUyc6XHJcbiAgICBpZiAodmFsdWUyICYmIEFycmF5LmlzQXJyYXkodmFsdWUyKSAmJiB2YWx1ZTIuZmluZEluZGV4KSB7XHJcbiAgICAgIHJldHVybiAhKCh2YWx1ZTIuZmluZEluZGV4KCh2YWwpID0+IHZhbHVlMS5pbmRleE9mKHZhbCkgPiAtMSkpID4gLTEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbnJldHVybiB0cnVlO1xyXG59O1xyXG4iXX0=